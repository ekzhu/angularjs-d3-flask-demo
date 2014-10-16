// Create the app module and declare its dependencies
// which includes the rest service module and controller module
var courseApp = angular.module('courseApp',['studentServices', 
	'courseAppControllers', 'd3directives'])

// Create the controller module, with no dependencies
var courseAppContrl = angular.module('courseAppControllers',[])

// Generate randomn grade following a normal distribution
var generate_random_grade = function(u, v) {
	var nrv = (chance.integer({min:0, max:10}) + chance.integer({min:0, max:10})) / 2
	var mean = 5
	var variance = (1/12)*(10 - 0)*(10 - 0)/Math.sqrt(2)
	var stdnrv = (nrv - mean) / variance
	return Math.ceil(stdnrv*v + u);
};

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
			name : chance.name(),
			grade : generate_random_grade(65, 30)
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
