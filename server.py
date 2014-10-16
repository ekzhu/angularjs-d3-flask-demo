# -*- coding: utf-8 -*-
from flask import Flask, request
from flask.ext.restful import Api, Resource, abort

# Create Flask app
app = Flask(__name__)

# Display the homepage
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Create RESTful API
api = Api(app, prefix="/rest")

# This is our small in-memory database with some
# simple collections of objects
Meta = {"curr_student_id" : 1}
Students = [{"name" : "Eric Zhu",
             "id" : 1,
             "grade" : 86},]

# Collection resource
class StudentsResource(Resource):
    
    def get(self):
        return Students

    def post(self):
        new_student = request.json
        student_id = new_student['id']
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

api.add_resource(StudentsResource, '/students',
                                    '/students/<int:student_id>')

if __name__ == '__main__':
    app.run(debug=True)