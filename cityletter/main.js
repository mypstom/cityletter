$(document).ready(function(){
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCbeNQASwlN1SiuMpH1K6l0xBtYSyOHscU",
        authDomain: "cityletter-5a2ca.firebaseapp.com",
        databaseURL: "https://cityletter-5a2ca.firebaseio.com",
        projectId: "cityletter-5a2ca",
        storageBucket: "cityletter-5a2ca.appspot.com",
        messagingSenderId: "503414773533"
    };
    firebase.initializeApp(config);

    //查看目前登入狀況
    var user;
    var loginUser;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            
            user = user;
            console.log(user);
            console.log("User is logined", user.providerData[0].photoURL)
            $(".pic").attr("src", user.providerData[0].photoURL);
            
            var userName = user.providerData[0].displayName;
            $(".name").text(userName);

            $("#fbLoginBtn").hide();
            $("#signoutSmtBtn").show();
            
            
            loginUser = firebase.auth().currentUser;
            if(!firebase.database().ref('/users/' + loginUser.uid)){
                firebase.database().ref('/users/' + loginUser.uid).set({
                    email: loginUser.email,
                    name: loginUser.displayName,
                    photoURL : loginUser.photoURL
                }).catch(function(error){
                    console.error("寫入使用者資訊錯誤",error);
                });
            }else{
                console.log("已經有帳號了");
            }

            firebase.database().ref('/posts/'+loginUser.uid).once("value", function(posts) {
                posts.forEach(function(post) {
                    //讀取 目前 所有的 瓶中信資料
                    //要放入地圖的 marker之中
                    console.log(post.val().title);
                    console.log(post.val().content); 
                });
            });
        } else {
            $("#fbLoginBtn").show();
            $("#signoutSmtBtn").hide();
            user = null;
            console.log("User is not logined yet.");
        }
    });

    

    //使用Popup註冊FB方式
    $("#fbLoginBtn").on("click", function(){
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // 取得FB Token，可以使用於FB API中
            var token = result.credential.accessToken;
            // 使用者資料
            var FBUser = result.user;
            console.log(FBUser);
            // firebase.database().ref('/users/' + loginUser.uid).once('value').then(function(snapshot) {})
            // if()
            // firebase.database().ref('users/' + loginUser.uid).set(資料)
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
        });
    });


    //登出
    $("#signoutSmtBtn").on("click", function(){
        firebase.auth().signOut().then(function() {
            console.log("User sign out!");
        }, function(error) {
            console.log("User sign out error!");
        })
    });

    $(".title-en").on("click", function(){
        var chicago = {lat: 41.850, lng: -87.650};
        map.setCenter(chicago)

    });

    $(".goHome").on("click", function(){

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                console.log(pos);

                
                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        }
    });

    $(".post").on("click", function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                console.log(pos);
                firebase.database().ref('/posts/' + loginUser.uid).push().set({
                    user: loginUser.uid,
                    title: "Test",
                    content: "content",
                    position: pos 
                }).catch(function(error){
                    console.error("送出信件錯誤",error);
                });
            }, function() {
            });
        }
    });
});
var map ;

function initMap() {
    // Styles a map in night mode.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.674, lng: -73.945},
      zoom: 30,
      disableDefaultUI: true,
      styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
    });
    var infoWindow = new google.maps.InfoWindow({map: map});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        console.log(pos);

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        map.setCenter(pos);
        }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
  }