const axios = require('axios');
/**
 * MealsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  add: function(req, res){
    res.view('add');
  },
  create: async function(req, res){
    let data = {
      order_name: req.body.ordername,
      order_type: req.body.ordertype,
      count: req.body.count
    };
    let url = "https://8ad4b0d6-ee4a-41cf-97ce-326bf48e0a61-bluemix.cloudantnosqldb.appdomain.cloud/meals";
    let apiKey = Buffer.from("apikey-v2-56ypoaz7wcakjd7lutkxxegvl9n820h9kcd24za6k62" + ':' + "c40d30b7366d28ddb738327cf197c2fa").toString('base64');
    let config = { headers: { 'Authorization': 'Basic ' + apiKey } };
    try {
      let status = await axios.post(url, data, config);
      res.redirect('/meals/list');
    } catch (error) {
      console.log(error);
    }
  },
  list: async function (req, res) {
    try {
      let url = "https://8ad4b0d6-ee4a-41cf-97ce-326bf48e0a61-bluemix.cloudantnosqldb.appdomain.cloud/meals/_all_docs?include_docs=true";
      let apiKey = Buffer.from("apikey-v2-56ypoaz7wcakjd7lutkxxegvl9n820h9kcd24za6k62" + ':' + "c40d30b7366d28ddb738327cf197c2fa").toString('base64');
      let config = { headers: { 'Authorization': 'Basic ' + apiKey } };
      let result = await axios.get(url, config);
      let orders = result.data.rows;
      res.view('list', { orders: orders });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
  edit: async function (req, res) {
    let id = req.query.id;
    let url = "https://8ad4b0d6-ee4a-41cf-97ce-326bf48e0a61-bluemix.cloudantnosqldb.appdomain.cloud/meals/" + id;
    let apiKey = Buffer.from("apikey-v2-56ypoaz7wcakjd7lutkxxegvl9n820h9kcd24za6k62" + ':' + "c40d30b7366d28ddb738327cf197c2fa").toString('base64');
    let config = { headers: { 'Authorization': 'Basic ' + apiKey } };
    try {
      let result = await axios.get(url, config);
      let order = result.data;
      res.view('edit', { order: order });
    } catch (error) {
      console.log(error);
    }
  },
  update: async function (req, res) {
    let id = req.query.id;
    let rev = await getRevId(id);
    let data = {
      order_name: req.body.ordername,
      order_type: req.body.ordertype,
      count: req.body.count
    };
    let url = "https://8ad4b0d6-ee4a-41cf-97ce-326bf48e0a61-bluemix.cloudantnosqldb.appdomain.cloud/meals/" + id + "?rev=" + rev;
    let apiKey = Buffer.from("apikey-v2-56ypoaz7wcakjd7lutkxxegvl9n820h9kcd24za6k62" + ':' + "c40d30b7366d28ddb738327cf197c2fa").toString('base64');
    let config = { headers: { 'Authorization': 'Basic ' + apiKey } };
    try {
      let status = await axios.put(url, data, config);
      res.redirect('/meals/list');
      return false;
    } catch (error) {
      console.log(error);
    }
  },
  delete: async function (req, res) {
    let id = req.query.id;
    let rev = await getRevId(id);
    let url = "https://8ad4b0d6-ee4a-41cf-97ce-326bf48e0a61-bluemix.cloudantnosqldb.appdomain.cloud/meals/" + id + "?rev=" + rev;
    let apiKey = Buffer.from("apikey-v2-56ypoaz7wcakjd7lutkxxegvl9n820h9kcd24za6k62" + ':' + "c40d30b7366d28ddb738327cf197c2fa").toString('base64');
    let config = { headers: { 'Authorization': 'Basic ' + apiKey } };
    try {
      let status = await axios.delete(url, config);
      res.redirect('/meals/list');
      return false;
    } catch (error) {
      console.log(error);
    }
  }
};

async function getRevId(id) {
  let url = "https://8ad4b0d6-ee4a-41cf-97ce-326bf48e0a61-bluemix.cloudantnosqldb.appdomain.cloud/meals/" + id;
  let apiKey = Buffer.from("apikey-v2-56ypoaz7wcakjd7lutkxxegvl9n820h9kcd24za6k62" + ':' + "c40d30b7366d28ddb738327cf197c2fa").toString('base64');
  let config = { headers: { 'Authorization': 'Basic ' + apiKey } };
  let result = await axios.get(url, config);
  return result.data._rev;
}

