// Create a module, declare dependency on ngResource module
var studentServices = angular.module('studentServices', ['ngResource']);

// Use module factory method to create a function that returns
// a new service
studentServices.factory('Students', ['$resource',
  function($resource) {
    return $resource('rest/students', {}, {
      query : {
      	method : 'GET',
      	isArray : true
      },
      remove : {
      	method : 'DELETE',
        url : 'rest/students/:student_id'
      },
      save : {
      	method : 'POST'
      }
    });
  }
]);