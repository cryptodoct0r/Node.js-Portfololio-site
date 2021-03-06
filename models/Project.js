/*
  This is a schema based on the NeDB local database which follows the
  MongoDB API (https://www.npmjs.com/package/nedb). The 'camo' library
  is an ORM for the NeDB implementation.

  Eventually, this should be replaced by a MONGOOSE schema when used in
  conjunction with Mongo DB. This would happen in the case of a
  developer taking over the project.
*/

// https://github.com/scottwrobinson/camo
const Document = require('vertex-camo').Document
const props = {
	name: {type:String, default:''},
	slug: {type:String, default:''},
	description: {type:String, default:''},
	image: {type:String, default:''},
  images: {type:Array, default:[]},
  link: {type:String, default:''},
	tags: {type:Array, default:[]},
	schema: {type:String, default:'project'},
	dateRange: {type:String, default:''}, // e.g. "Feb 2018 - Dec 2018"
	dateString: {type:String, default:''},
	timestamp: {type:Date, default: new Date()}
}

class Project extends Document {
	constructor(){
		super()
		this.schema(props)

		// this is how to set default values on new instances
		this.timestamp = new Date()
	}

	summary(){
		const summary = {id: this._id}
		Object.keys(props).forEach(prop => {
			summary[prop] = this[prop] || props[prop].default
		})

		return summary
	}

	static get resourceName(){
		return 'project'
	}

	static collectionName(){
			return 'projects'
	}

	static convertToJson(projects){
		return projects.map(project => {
			return project.summary()
		})
	}

	/*
		the following static methods are implemented to mirror the
		Mongoose ORM methods, such that if you port this over to MongoDB,
		there should be no need to change the controller functions
	*/

	static create(params){
		const instance = new Project()
		Object.keys(props).forEach(prop => {
			instance[prop] = params[prop] || props[prop].default
		})

		instance['timestamp'] = new Date()
		return instance.save()
	}

	static findById(id){
		return Project.findOne({_id: id})
	}

	static findByIdAndUpdate(id, params){
		return Project.findOneAndUpdate({_id:id}, params, {upsert:true})
	}

	static findByIdAndRemove(id){
		return Project.findOneAndDelete({_id:id})
	}
}

module.exports = Project
