angular.module('eecs-user', ['autocomplete'])
    .constant('env', 'prod')
    .constant(
        'base_url', {
            dev: 'http://localhost/su-ecs-purchase/api/index.php',
            prod: 'http://ecs-test.dipenpradhan.com/su-ecs-purchase/api/index.php'
        })
    .constant(
        'endpoints', {
            placeOrder: '/orders/placeorder',
            getProfessors: '/users/professors'
        })
    .service('API',function(env,base_url,endpoints){
        this.placeOrder = base_url[env]+endpoints.placeOrder;
        this.getProfessors = base_url[env]+endpoints.getProfessors;
    })
    .run(function (API, $http, $q, $rootScope) {

        // Models --

        $rootScope.user = {};

        // Functions --
        $rootScope.init = function () {
            return $q(function (resolve) {
                // var userID = prompt('Please enter your user ID:');
                // // var password = prompt('Please enter your user ID:');
                // $http.post(API.getUser, {
                //     'username': userID
                // }).success(function(response) {
                //     $rootScope.user = response;
                //     resolve();
                // }).error(function() {
                //     // alert('Couldn\'t identify you.');
                //     window.location.href = 'error.html';
                // });
                resolve();
            });
        };

        // Run --
        // Nothing

    })
    .controller('MainCtrl', ['API', '$http', '$rootScope', '$scope', '$timeout', function (API, $http, $rootScope, $scope, $timeout) {

        // Models --
        $scope.purchaseItems = [];
        $scope.order = {
            'project_name': '',
            'student_name': '',
            'student_email': '',
            'prof_name': '',
            'prof_email': '',
            'date_created': '',
            'date_needed': '',
            'vendor': '',
            'user_type': 'professor',
            'items': $scope.purchaseItems,
            'total_price':0
        };
        $scope.products = []; //{'id':1,'name':'test'},{'id':2,'name':'2'}];
        $scope.cart = [];

        $scope.emptyPurchaseItem = {
            'qty': 1,
            'item_no': '',
            'description': '',
            'purpose': '',
            'unit_price': 0.00,
            'total_price':0.00
        };
        $scope.professors = [];
        $scope.professorNames = [];
        $scope.formError = false;
        $scope.purchaseItems.push(angular.copy($scope.emptyPurchaseItem));
        $scope.$watch('order.items', function (newVal, oldVal) {
            var total = 0;
            for (var i = 0; i < $scope.order.items.length; i++) {
                //console.log($scope.order.items[i]);
                var pItem = $scope.order.items[i];
                if (pItem.qty >= 0 && pItem.unit_price >= 0) {
                    $scope.order.items[i].total_price=(pItem.qty * pItem.unit_price).toFixed(2);
                    total += pItem.qty * pItem.unit_price;
                }
            }
            $scope.order.total_price=total.toFixed(2);
        }, true);


        // Functions --
        $scope.getProducts = function () {
            $http.post(API.getProducts, {
                    'username': $rootScope.user.email
                })
                .success(function (response) {
                    $scope.products = response.products;
                })
                .error(function () {
                    alert('Error fetching data.');
                });
        };

        $scope.getProfessors = function () {
            $http.get(API.getProfessors, {params: {}}).success(function (response) {
                $scope.professors = response.professors;
                for (var i = 0; i < $scope.professors.length; i++) {
                    $scope.professorNames.push($scope.professors[i].name);
                }

            }).error(function () {
                alert('Couldn\'t fetch order.');
            });
        };


        $scope.addItem = function (i) {
            $scope.cart.push(angular.copy($scope.products[i]));
        };

        $scope.removeItem = function () {
            $scope.cart = [];
        };
        $scope.removePurchaseItem = function (i) {
            $scope.purchaseItems.splice(i, 1);
        };
        $scope.submitPurchaseItems = function () {

            if ($scope.order.project_name.length < 1) {
                $scope.formError = true;
            }

            if ($scope.order.user_type == 'student' && $scope.order.student_name.length < 1) {
                $scope.formError = true;
            }
            if ($scope.order.user_type == 'student' && $scope.order.student_email.length < 1) {
                $scope.formError = true;
            }
            if ($scope.order.prof_name.length < 1) {
                $scope.formError = true;
            }
            if ($scope.order.prof_email.length < 1) {
                $scope.formError = true;
            }
            if ($scope.order.date_needed.length < 1) {
                $scope.formError = true;
            }
            if ($scope.order.vendor.length < 1) {
                $scope.formError = true;
            }
            if ($scope.order.items.length < 1) {
                $scope.formError = true;
            }
            $timeout(function () {
                $scope.formError = false
            }, 3000);

            $scope.order.date_created = moment().toDate();
            console.log($scope.order);
            if (!$scope.formError) {
                $scope.postOrder();
            }
        };
        $scope.postOrder = function () {
            $http.post(API.placeOrder, $scope.order)
                .success(function (response) {
                    alert('Order ID: ' + response.order_id);
                    window.location.reload();
                }).error(function () {
                alert('Couldn\'t place your order. Please try again.');
                //window.location.reload();
            });
        };

        $scope.addRow = function () {
            $scope.purchaseItems.push(angular.copy($scope.emptyPurchaseItem));
        };

        $scope.qtyPlus = function (i) {
            $scope.purchaseItems[i].qty++;
        };
        $scope.qtyMinus = function (i) {
            $scope.purchaseItems[i].qty--;
        };

        $scope.updateProfs = function (typed) {
            var found = false;
            for (var i = 0; i < $scope.professors.length; i++) {
                if ($scope.professors[i].name == typed) {
                    $scope.order.prof_name = $scope.professors[i].name;
                    $scope.order.prof_email = $scope.professors[i].email;
                    found = true;
                    break;
                }
            }
            if (!found) {
                $scope.order.prof_email = '';
            }
        };
        $scope.selectProf = function (typed) {
            var found = false;
            for (var i = 0; i < $scope.professors.length; i++) {
                if ($scope.professors[i].name == typed) {
                    $scope.order.prof_name = $scope.professors[i].name;
                    $scope.order.prof_email = $scope.professors[i].email;
                    found = true;
                    break;
                }
            }
            if (!found) {
                $scope.order.prof_name = '';
                $scope.order.prof_email = '';
            }
        };
        // Run --

        $rootScope.init().then(function () {

            $scope.getProfessors();
        });

    }]).directive('elastic', [
    '$timeout',
    function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function () {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };
    }
]).directive('dateTimePicker', function ($timeout, $parse) {
    return {
        link: function ($scope, element, $attrs) {
            return $timeout(function () {
                var ngModelGetter = $parse($attrs['ngModel']);

                return $(element).datetimepicker(
                    {
                        minDate: moment().add(-1, 'd').toDate(),
                        sideBySide: false,
                        allowInputToggle: true,

                        useCurrent: false,
                        //defaultDate:moment().add(1, 'd').add(1,'h'),
                        icons: {
                            time: 'icon-back-in-time',
                            date: 'icon-calendar-outlilne',
                            up: 'icon-up-open-big',
                            down: 'icon-down-open-big',
                            previous: 'icon-left-open-big',
                            next: 'icon-right-open-big',
                            today: 'icon-bullseye',
                            clear: 'icon-cancel'
                        },
                        format: 'YYYY-MM-DD'

                    }
                ).on('dp.change', function (event) {
                    $scope.$apply(function () {
                        return ngModelGetter.assign($scope, event.target.value);
                    });
                });
            });
        }
    };
});
