// Create the app module and declare its dependencies
// which includes the rest service module and controller module
var courseApp = angular.module('courseApp',['studentServices', 'courseAppControllers'])

// Create the controller module, with no dependencies
var courseAppContrl = angular.module('courseAppControllers',[])

// Create a student table controller, declare depednency on 
// Students service
courseAppContrl.controller('StudentList', ['$scope','Students', function($scope, Students){
	$scope.students = Students.query();
	$scope.generate_random_student = function(students) {
		// Find maximum id number
		var max_id = Math.max.apply(Math, students.map(function(s){
			return s.id;
		}));
		// If the array is empty and the above returns - infinity
		if (max_id == -Infinity) {
			max_id = 0;
		}
		// Create a new student
		var new_student = {
			id : max_id + 1,
			name : "Always this name",
			grade : 90
		};
		// Save the new student
		Students.save(new_student);
		// Refresh
		$scope.students = Students.query();
	};
	$scope.drop = function(student) {
		Students.remove({student_id : student.id});
		// Refresh
		$scope.students = Students.query();
	};
}]);