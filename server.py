# -*- coding: utf-8 -*-
from flask import Flask, request, abort
from flask.ext import restful

app = Flask(__name__)
api = restful.Api(app)

# This is our small in-memory database with some
# simple collections of objects
Meta = {"curr_student_id" : 1}
Students = [{"name" : "Eric Zhu",
			 "id" : 1,
			 "degree" : "Master of Science",
			 "took" : [{"course_code" : "csc2208",
			 		  	"grade" : 86},]},]
Courses = [{"name" : "Advance Operating Systems",
			"code" : "csc2208"}]

# Collection resource
class StudentsResource(restful.Resource):
	def get(self):
		return Students

class CoursesResource(restful.Resource):
	def get(self):
		return Courses


# Individual resource
class StudentResource(restful.Resource):
    
    def get(self, student_id):
    	select = [s for s in Students if s['id'] == student_id]
    	if len(select) != 1:
    		abort(400)
        return select[0]

    def put(self, student_id):
    	if not request.is_json:
    		abort(400)
    	new_student = request.data
    	new_student['id'] = student_id
    	select = [s for s in Students if s['id'] == student_id]
    	if len(select) == 1:
    		# if the student already exist, apply updates
    		select[0] = new_student
    	elif len(select) == 0:
    		# if not exist before, add new
    		Students.append(new_student)
    	else:
    		# we get error
    		abort(500)
    	return {'status' : 'acknowledged'}, 201

    def delete(self, student_id):
    	Students[:] = [s for s in Students if s['id'] != student_id]
    	return {'status' : 'acknowledged'}, 204


class CourseResource(restful.Resource):
    
    def get(self, course_code):
    	select = [s for s in Courses if s['code'] == course_code]
    	if len(select) != 1:
    		abort(400)
        return select[0]

    def put(self, course_code):
    	if not request.is_json:
    		abort(400)
    	new_course = request.data
    	new_course['code'] = course_code
    	select = [s for s in Courses if s['code'] == course_code]
    	if len(select) == 1:
    		# exist, update
    		select[0] = new_course
    	elif len(select) == 0:
    		# new coures, add
    		Courses.append(new_course)
    	else:
    		# error
    		abort(500)
    	return {'status' : 'acknowledged'}, 201

    def delete(self, course_code):
    	Courses[:] = [s for s in Courses if s['code'] != course_code]
    	return {'status' : 'acknowledged'}, 204


api.add_resource(StudentsResource, '/students')
api.add_resource(CoursesResource, '/courses')
api.add_resource(StudentResource, '/students/<int:student_id>')
api.add_resource(CourseResource, '/courses/<string:course_code>')

if __name__ == '__main__':
    app.run(debug=True)