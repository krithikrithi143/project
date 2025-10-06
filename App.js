var app = angular.module("authApp", ["ngRoute"]);

app.config(function($routeProvider) {
  $routeProvider
    .when("/login", {
      template: `
        <div class="login-container">
          <h2>Login</h2>
          <form ng-submit="login()">
            <div class="error-msg" ng-show="error">{{error}}</div>
            <input type="email" ng-model="email" placeholder="Email" required>
            <input type="password" ng-model="password" placeholder="Password" required>
            <button type="submit">Login</button>
          </form>
        </div>
      `,
      controller: "LoginController"
    })
    .when("/dashboard", {
      template: `
        <div class="dashboard-container">
          <h2>Welcome, {{user.email}}</h2>
          <button ng-click="logout()">Logout</button>
        </div>
      `,
      controller: "DashboardController"
    })
    .otherwise({ redirectTo: "/login" });
});

app.service("AuthService", function() {
  const credentials = { email: "user@example.com", password: "123456" };
  this.login = function(email, password) {
    return email === credentials.email && password === credentials.password;
  };
});

app.controller("LoginController", function($scope, $location, $rootScope, AuthService) {
  $scope.login = function() {
    if(AuthService.login($scope.email, $scope.password)) {
      $rootScope.user = { email: $scope.email };
      $location.path("/dashboard");
    } else {
      $scope.error = "Invalid email or password!";
    }
  };
});

app.controller("DashboardController", function($scope, $rootScope, $location) {
  if(!$rootScope.user) {
    $location.path("/login");
    return;
  }
  $scope.user = $rootScope.user;

  $scope.logout = function() {
    $rootScope.user = null;
    $location.path("/login");
  };
});
