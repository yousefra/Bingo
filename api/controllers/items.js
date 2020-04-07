const Item = require('../models/item');
const fs = require('fs');

exports.getAll = (req, res, next) => {
	Item.find()
		.populate('category', 'name')
		.then(docs => {
			res.status(200).json({
				count: docs.length,
				items: docs
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};

exports.getItemsByCategory = (req, res, next) => {
	const id = req.params.categoryId;
	Item.find({ category: id })
		.select('_id name backColor image createdDate')
		.then(docs => {
			res.status(200).json({
				count: docs.length,
				items: docs
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};

exports.createItem = (req, res, next) => {
	const item = new Item({
		name: req.body.name,
		image: req.file.path,
		backColor: req.body.backColor,
		category: req.body.category,
		createdDate: new Date()
	});
	item.save()
		.then(result => {
			res.status(201).json({
				message: 'Item added',
				createdItem: {
					_id: result._id,
					name: result.name,
					image: result.image,
					backColor: result.backColor,
					category: result.category,
					createdDate: result.createdDate
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};

exports.updateItem = (req, res, next) => {
	const id = req.params.itemId;
	const fileChanged = req.file !== undefined;
	const updateOps = {};
	for (const ops of JSON.parse(req.body.body)) {
		updateOps[ops.propName] = ops.value;
	}
	if (fileChanged) {
		updateOps.image = req.file.path;
	}
	Item.findById(id)
		.select('image')
		.then(doc => {
			if (!doc) {
				res.status(404).json({
					message: 'Item not found'
				});
			}
			console.log(doc);
			if (fileChanged) {
				console.log(`Removing [${doc.image}]`);
				fs.unlinkSync(doc.image);
				console.log(`Removed [${doc.image}]`);
			}
			return Item.findOneAndUpdate({ _id: id }, { $set: updateOps }, { new: true });
		})
		.then(result => {
			res.status(200).json({
				message: 'Item updated successfully',
				updatedItem: result
			})
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};

exports.deleteItem = (req, res, next) => {
	const id = req.params.itemId;
	Item.findById(id)
		.select('image')
		.then(doc => {
			if (!doc) {
				res.status(404).json({
					message: 'Item not found'
				});
			}
			// console.log(`Removing [${doc.image}]`);
			// fs.unlinkSync(doc.image);
			// console.log(`Removed [${doc.image}]`);
			return Item.deleteOne({ _id: id });
		})
		.then(result => {
			res.status(200).json({
				message: 'Item deleted'
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};