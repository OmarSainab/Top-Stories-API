const { selectTopics } = require("../models/ncnewsmodels");

exports.getTopics = (request, response, next) => {

selectTopics()
.then((topics) =>{
response.status(200).send({ topics });
})
.catch((error) => {
    next(error);
});

};

