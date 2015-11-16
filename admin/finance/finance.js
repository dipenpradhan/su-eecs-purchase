angular.module('eecs-finance', ['ngRoute'])
    .constant('env', 'dev')
    .constant(
        'base_url', {
            dev: 'http://localhost/su-ecs-purchase/api/index.php',
            prod: 'http://ecs-test.dipenpradhan.com/su-ecs-purchase/api/index.php'
        })
    .constant(
        'endpoints', {
            getOrders: '/orders/getOrders',
            getOrder: '/orders/getOrders',
            approveOrder: '/orders/approveOrder'
        })
    .service('API',function(env,base_url,endpoints){
        this.getOrders = base_url[env]+endpoints.getOrders;
        this.getOrder = base_url[env]+endpoints.getOrder;
        this.approveOrder = base_url[env]+endpoints.approveOrder;
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/orders/:type', {
                templateUrl: 'orders.html',
                controller: 'OrdersCtrl'
            })
            .when('/order/:id', {
                templateUrl: 'order.html',
                controller: 'OrderCtrl'
            })
            .when('/', {
                redirectTo: '/orders/all'
            })
            .otherwise({
                redirectTo: '/orders'
            });
    })
    .run(function (API, $http, $q, $rootScope) {

        // Models --
        $rootScope.admin = {};


        // Functions --
        $rootScope.init = function () {
            return $q(function (resolve) {

                //var adminID = prompt('Please enter your admin ID:');
                //$http.post(API.getAdmin, {'username': adminID}).success(function (response) {
                //    $rootScope.admin = response;
                //    resolve();
                //}).error(function () {
                //
                //    window.location.href = 'error.html';
                //});
            });
        };

        // Run --
        // Nothing

    })
    .controller('OrderCtrl', ['API', '$http', '$routeParams', '$scope', '$timeout','$location',function (API, $http, $routeParams, $scope, $timeout,$location) {
        // Models --
        $scope.order={'id':''};
        $scope.approvalItems = [];
        $scope.approval = {
            'order_id':$scope.order.id,
            'req_no': '',
            'delivery_address': '',
            'delivery_attn': '',
            'chartstrings': '',
            'items': $scope.approvalItems

        };
        $scope.emptyApprovalItem = {
            'item_no': '',
            'fund': '',
            'dept': '',
            'program': '',
            'acct': '',
            'mycode': '',
            'project': '',
            'activity': '',
            'bud_ref': '',
            'dept_auth_sign': '',
            'amount': ''
        };
        $scope.approvalItems.push(angular.copy($scope.emptyApprovalItem));
        // Functions --
        $scope.getOrder = function (id) {
            $http.get(API.getOrder, {params: {'id': id}}).success(function (response) {
                $scope.order = response.orders[0];
            }).error(function () {
                alert('Couldn\'t fetch order.');
            });
        };

        // Run --

        if ($routeParams.id) {
            $scope.getOrder($routeParams.id);
        }

        $scope.removeApprovalItem = function (i) {
            $scope.approvalItems.splice(i, 1);
        };

        $scope.addRow = function () {
            $scope.approvalItems.push(angular.copy($scope.emptyApprovalItem));
        };
        $scope.postApproval = function () {
            $http.post(API.approveOrder, $scope.approval)
                .success(function (response) {
                    alert('Approval ID: ' + response.approval_id);
                    $location.path('/orders/all');
                    //window.location.reload();
                }).error(function () {
                alert('Couldn\'t place your order. Please try again.');
                //window.location.reload();
            });
        };

        $scope.submitApproval = function () {

            if ($scope.approval.req_no.length < 1) {
                $scope.formError = true;
            }
            if ($scope.approval.delivery_address == 'student' && $scope.approval.delivery_address.length < 1) {
                $scope.formError = true;
            }
            if ($scope.approval.delivery_attn == 'student' && $scope.approval.delivery_attn.length < 1) {
                $scope.formError = true;
            }
            if ($scope.approval.chartstrings.length < 1) {
                $scope.formError = true;
            }
            if ($scope.approval.items.length < 1) {
                $scope.formError = true;
            }
            $scope.approval.order_id = $scope.order.id;
            $timeout(function () {
                $scope.formError = false
            }, 3000);

            console.log($scope.approval );
            if (!$scope.formError) {
                $scope.postApproval();
            }
        };


    }])
    .controller('OrdersCtrl', ['API', '$http', '$location', '$routeParams', '$scope', function (API, $http, $location, $routeParams, $scope) {

        // Models --
        $scope.orders = [];

        // Functions --
        $scope.getOrders = function (type) {
            console.log(API.getOrders);
            $http.get(API.getOrders, {params: {'type': type}}).success(function (response) {
                $scope.orders = response.orders;
            }).error(function () {
                alert('Couldn\'t fetch orders.');
            });
        };

        // Run --
        if ($routeParams.type === 'processed' || $routeParams.type === 'pending' || $routeParams.type === 'all') {
            $scope.getOrders($routeParams.type);
        } else {
            $location.path('/orders/all');
        }


    }])
    .controller('MainCtrl', ['API', '$http', '$rootScope', '$scope', function (API, $http, $rootScope, $scope) {


        // Run --
        $rootScope.init().then(function () {
            // $scope.getProducts();
        });

    }]);