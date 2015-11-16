angular.module('eecs-admin', ['ngRoute'])
    .constant('env', 'dev')
    .constant(
        'base_url', {
            dev: 'http://localhost/su-ecs-purchase/api/index.php',
            prod: 'http://ecs-test.dipenpradhan.com/su-ecs-purchase/api/index.php'
        })
    .constant(
        'endpoints', {
            getApprovals: '/orders/getApprovedOrders',
            getApproval: '/approvals/getApproval',
            ackOrder: '/orders/ackOrder'
        })
    .service('API',function(env,base_url,endpoints){
        this.getApprovals = base_url[env]+endpoints.getApprovals;
        this.getApproval = base_url[env]+endpoints.getApproval;
        this.ackOrder = base_url[env]+endpoints.ackOrder;
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/approvals/:type', {
                templateUrl: 'orders.html',
                controller: 'OrdersCtrl'
            })
            .when('/approval/:id', {
                templateUrl: 'approval.html',
                controller: 'ApprovalCtrl'
            })
            .when('/', {
                redirectTo: '/approvals/all'
            })
            .otherwise({
                redirectTo: '/approvals'
            });
    })
    .run(function (base_url, API, $http, $q, $rootScope) {

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
    .controller('ApprovalCtrl', ['API', '$http', '$routeParams', '$scope', '$timeout','$location', function (API, $http, $routeParams, $scope, $timeout,$location) {
        // Models --
        $scope.order = {'id': ''};
        $scope.approvalItems = [];
        $scope.approval = {
            'order_id': $scope.order.id,
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
        $scope.getApproval = function (id) {
            $http.get(API.getApproval, {params: {'id': id}}).success(function (response) {
                $scope.order = response.order;
                $scope.approval = response.approval;
            }).error(function () {
                alert('Couldn\'t fetch order.');
            });
        };


        if ($routeParams.id) {
            $scope.getApproval($routeParams.id);
        }

        $scope.ackOrder = function (id) {
            $http.get(API.ackOrder, {params: {id: id}}).success(function (response) {
                if(response.success==true){
                    alert('Acknowledgement Successful! An E-mail has been sent to everyone involved about the acknowledgement.');
                    $location.path('/approvals/all')
                }else{
                    alert('Couldn\'t acknowledge.');
                }
            }).error(function () {
                alert('Couldn\'t acknowledge.');
            });
        };

    }])
    .controller('OrdersCtrl', ['API', '$http', '$location', '$routeParams', '$scope', function (API, $http, $location, $routeParams, $scope) {

        // Models --
        $scope.orders = [];

        // Functions --
        $scope.getOrders = function (type) {
            $http.get(API.getApprovals, {params: {'type': type}}).success(function (response) {
                $scope.orders = response.orders;
            }).error(function () {
                alert('Couldn\'t fetch orders.');
            });
        };

        // Run --
        if ($routeParams.type === 'processed' || $routeParams.type === 'ack' || $routeParams.type === 'all') {
            $scope.getOrders($routeParams.type);
        } else {
            $location.path('/approvals/all');
        }


    }])
    .controller('MainCtrl', ['API', '$http', '$rootScope', '$scope', function (API, $http, $rootScope, $scope) {


        // Run --
        $rootScope.init().then(function () {
            // $scope.getProducts();
        });

    }]);