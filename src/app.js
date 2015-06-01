var xApp = angular.module('xApp', [
    'ngSanitize',
    'ngResource',
    'ngAnimate',
    'ngCookies',
    'ui.bootstrap',
    'ui.router',
    'ui.select',
    'angularMoment',
    'toaster',
    'angular-jwt',
    'cfp.hotkeys'
]);

xApp.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    'uiSelectConfig',
    'jwtInterceptorProvider',
function($stateProvider, $urlRouterProvider, $httpProvider, uiSelectConfig, jwtInterceptorProvider) {

    uiSelectConfig.theme = 'bootstrap';

    $stateProvider
        .state('anon', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: ['anon']
            }
        })
        .state('anon.check', {
            url: '',
            controller: function($location, AuthFactory) {
                if (AuthFactory.isLoggedIn()) {
                    $location.path('/recent');
                } else {
                    $location.path('/login');
                }
            }
        })
        .state('anon.login', {
            url: '/login',
            templateUrl: '/t/auth/login.html',
            controller: 'AuthController'
        });

    $stateProvider
        .state('user', {
            abstract: true,
            templateUrl: '/t/home/home.html',
            controller: function($scope, $rootScope, $location, $modal, projects, AuthFactory, Api, $filter, $state, hotkeys) {
                $scope.projects = projects;

                $scope.login = AuthFactory.getUser();

                $scope.projectTeams = teams;
                $scope.assignedTeams = teamsAssigned;

                var sidebarOpen = false;

                hotkeys.add({
                    combo: 'ctrl+p',
                    description: 'Show project jump window',
                    allowIn: ['input', 'select', 'textarea'],
                    callback: function(event, hotkey) {
                        event.preventDefault();
                        $scope.$broadcast('openJump');
                    }
                });

                function teamsAssigned(project) {
                    $modal.open({
                        templateUrl: '/t/project-team/assigned.html',
                        controller: 'AssignedTeamController',
                        resolve: {
                            teams: function(Api) {
                                return Api.assignedTeams.query({id: project.id});
                            }
                        }
                    });
                }

                function teams(project) {
                    $modal.open({
                        templateUrl: '/t/project-team/teams.html',
                        controller: 'ProjectTeamController',
                        resolve: {
                            teams: function(Api) {
                                return Api.team.query();
                            },
                            access: function(Api) {
                                return Api.projectTeams.query({id: project.id});
                            },
                            project: function() {
                                return project;
                            }
                        }
                    });
                }

                $(document).on('click', '.site-overlay', function() {
                    $scope.toggle(true);
                }).on('keyup', function(e) {
                    if (e.keyCode == 27 && sidebarOpen && !$('.modal').length) {
                        $scope.toggle(true);
                    }
                });

                $scope.updateProject = function(project) {
                    $modal.open({
                        templateUrl: '/t/project/form.html',
                        controller: 'ModalUpdateProjectController',
                        resolve: {
                            project: function(Api) {
                                return Api.project.get({id: project.id});
                            }
                        }
                    }).result.then(function (model) {
                        $scope.projects[$scope.projects.splice($scope.projects.map(function (i) {return i.id;}).indexOf(project.id), 1)] = model;
                    });
                };

                $scope.projectOwnerInfo = function(project) {
                    $modal.open({
                        templateUrl: '/t/project/owner.html',
                        controller: 'ModalProjectOwnerController',
                        resolve: {
                            owner: function(Api) {
                                return Api.user.get({id: project.user_id});
                            }
                        }
                    });
                };

                $scope.deleteProject = function(project) {
                    if (!confirm('Are you sure?')) {
                        return;
                    }
                    Api.project.delete({id: project.id});
                    $scope.projects.splice($scope.projects.map(function (i) {return i.id;}).indexOf(project.id), 1);

                    $location.path('/recent');
                };

                $scope.openFirst = function ($event) {
                    if ($event.which === 13) {
                        var project = $filter('filter')(projects, $scope.projectFilter)[0];
                        if (project) {
                            $location.path('/project/' + project.id);
                        }
                    }
                };

                $scope.createProject = function() {
                    $modal.open({
                        templateUrl: '/t/project/form.html',
                        controller: 'ModalCreateProjectController'
                    }).result.then(function (model) {
                        $scope.projects.push(model);
                    });
                };

                $scope.toggle = function(close) {
                    if ($('.pushy').hasClass('pushy-open') || close) {
                        $('.pushy').removeClass("pushy-open");
                        $('#container').removeClass("container-push");
                        $('body').removeClass("pushy-active");
                        sidebarOpen = false;
                    } else {
                        $('.pushy').addClass("pushy-open");
                        $('#container').addClass("container-push");
                        $('body').addClass("pushy-active");
                        sidebarOpen = true;
                    }
                }
            },
            resolve: {
                projects: function(ProjectsFactory) {
                    return ProjectsFactory.query();
                }
            }
        })
        .state('user.home', {
            url: '/recent',
            templateUrl: '/t/home/recentlyUsed.html',
            controller: 'HomeController',
            resolve: {
                recent: function(RecentFactory) {
                    return RecentFactory.query();
                }
            }
        })
        .state('user.project', {
            url: '/project/:projectId',
            views: {
                head: {
                    templateUrl: '/t/project/pageHeader.html',
                    controller: 'ProjectController',
                    resolve: {
                        projects: function(projects) {
                            return projects;
                        }
                    }
                },
                content: {
                    templateUrl: '/t/entry/list.html',
                    controller: 'EntryController',
                    resolve: {
                        entries: function(ProjectKeysFactory, projectId) {
                            return ProjectKeysFactory.keys({id: projectId});
                        }
                    }
                }
            },
            resolve: {
                projectId: function ($stateParams) {
                    return $stateParams.projectId;
                }
            }
        })
        .state('user.list', {
            url: '/users',
            templateUrl: '/t/user/userList.html',
            controller: 'UserListController',
            resolve: {
                users: function(Api) {
                    return Api.user.query();
                }
            }
        })
        .state('user.history', {
            url: '/history',
            templateUrl: '/t/history/list.html',
            controller: 'HistoryController',
            resolve: {
                history: function(HistoryFactory) {
                    return HistoryFactory.query();
                }
            }
        })
        .state('user.teams', {
            url: '/teams',
            templateUrl: '/t/team/teamList.html',
            controller: 'TeamListController',
            resolve: {
                teams: function(Api) {
                    return Api.team.query();
                }
            }
        })
        .state('user.404', {
            url: '/404',
            templateUrl: '/t/error/404.html'
        });

    $urlRouterProvider.otherwise('/404');

    jwtInterceptorProvider.tokenGetter = function(config, AuthFactory) {
        var idToken = AuthFactory.getToken();

        if (config.url.substr(config.url.length - 5) == '.html') {
            return null;
        }

        if (idToken && AuthFactory.tokenExpired()) {
            return AuthFactory.refreshToken();
        }

        return idToken;
    };

    $httpProvider.interceptors.push('jwtInterceptor');
    $httpProvider.interceptors.push('AuthInterceptor');
}]);
