const Category = require('../models/category');
const Item = require('../models/item');
const _ = require('underscore');

exports.getAll = (req, res, next) => {
	Item.aggregate([
		{ $group: { _id: '$_id', count: { $sum: 1 } } }
	])
		.then(items => {
			Category.find()
				.then(categories => {
					// Object.defineProperty(categories, "count", { value: 0 });
					// categories = categories.map(c => ({ ...c, count: 0 }));
					let result = _.map(categories, item => {
						return _.extend(item, _.findWhere(items, { _id: item._id }));
					});
					res.status(200).json({
						count: result.length,
						categories: result
					})
				})
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
};

exports.createCategory = (req, res, next) => {
	const category = new Category({
		name: req.body.name,
		title: req.body.title,
		createdDate: new Date()
	});
	category.save()
		.then(result => {
			res.status(201).json({
				message: 'Category added',
				createdCategory: {
					_id: result._id,
					name: result.name,
					title: result.title,
					createdDate: result.createdDate
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};

exports.updateCategory = (req, res, next) => {
	const id = req.params.categoryId;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Category.findOneAndUpdate({ _id: id }, { $set: updateOps })
		.then(result => {
			res.status(200).json({
				message: 'Category updated successfully',
				updatedCategory: result
			})
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};

exports.deleteCategory = (req, res, next) => {
	Category.deleteOne({ _id: req.params.categoryId })
		.then(result => {
			res.status(200).json({
				message: 'Category deleted'
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};