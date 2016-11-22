
(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('MainApp',['ngRoute','ngMessages','ngMaterial','OfficeModule','EmployeeModule','PlanesModelsModule','UnionModule']);


    angular.module('MainApp').config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                    templateUrl: '/index',
                    controller: 'planesModelsController',
                //TODO: CHANGE THIS TO A PERSONAL QUERY PAGE
            })
            .when('/cargo', {
                templateUrl: '/cargo',
                controller: 'officeController',
            })
            .when('/funcionario', {
                templateUrl: '/funcionario',
                controller: 'employeeController',
            })
            .when('/sindicato', {
                templateUrl: '/sindicato',
                controller: 'unionController',
            })
            .when('/modelos', {
                templateUrl: '/modelos',
                controller: 'planesModelsController',
            })

    });
    /**
     * TODO:Move controller to a separated file.
     */
    angular.module('MainApp').controller('mainController', function ($scope, $http,$mdDialog,$mdToast) {
        $scope.currentPage = 'cargos';

        function showSimpleToast(message) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position("bottom right")
                    .hideDelay(3000)
            );
        }


        function DialogController($scope, $mdDialog, item, requestItems) {
            tryParseNtoN(item);
            $scope.item = Object.assign({},item); //Prevent two way data bind.


            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                if(!$scope.form.$valid){
                    return;
                }

                tryParseNtoN(answer);
                $mdDialog.hide(answer);
            };

            $scope.getFrom = function (url,keyForScope){
                $http.get(url).then(function (response) {
                    $scope[keyForScope] = response.data;
                });
            };

            //pre requests from selects
            if(requestItems){
                if(requestItems instanceof Array) {
                    requestItems.forEach((args) => {
                        $scope.getFrom.apply(this,args);
                    })
                }
            }

        }


        //Dunno if it works..but should (not covering floats, im too lazy)
        function tryParseNtoN(obj){
            Object.keys(obj).map((x)=>{
                try{
                    obj[x] = isNaN(Number(obj[x])) ? obj[x] :Number(obj[x]);
                } catch (e){
                }
                return obj[x];
            })
        }


        /**Comparisons on only one level deep, return the diffs on obj one.*/
        function getDiff(objOne,objTwo){
            let diff = {};
            Object.keys(objOne).map((x)=>{
                if(objOne[x]!=objTwo[x]){
                    diff[x] = objOne[x];
                }
            });
            return diff;
        }

        function getDateInIdForm() {
            return Number(String(+new Date).substr(2,13));
        }

        //FIXME: move to global scope.
        window.getDiff = getDiff;
        window.getDateInIdForm = getDateInIdForm;
        window.DialogController = DialogController;
        window.showSimpleToast = showSimpleToast;
        window.tryParseNtoN = tryParseNtoN;



    });
})();