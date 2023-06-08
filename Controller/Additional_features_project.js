const userModel = require('../Model/UserModel')
const projectModel = require('../Model/UserProject')

const getTopLiked = async (req, res) => {
    try {
        const result = await projectModel.aggregate([
            {
                $project:
                {
                    likePeoplecount: { $size: "$likePeople" },
                    originalFields: "$$ROOT",
                    _id: 0
                }
            },
            {
                $sort: { likePeoplecount: -1 }
            },
            { $limit: 5 }, {
                $project: {
                    likePeoplecount: 0,
                }
            }
        ])
        // const result=await ?projectModel.find({}).sort({likePeople:-1});
        res.status(200).send([...result]);
    } catch (err) {
        console.log(err);
    }
}
const getDistinctIndustry = async (req, res) => {
    // Mongoose abstracts the MongoDB aggregation framework and provides a 
    // convenient way to use .distinct() directly on the model. When you execute the query, Mongoose translates it 
    // into an aggregation pipeline command to retrieve the distinct 
    // values of the specified field (industry) from the entire 
    // collection in a single database query.
    try {
        const result = await projectModel.distinct("Industry");
        res.status(200).send(result);

    } catch (err) {
        res.status(500).send("Internal server error");
    }
}
const getData = async (req, res) => {
    try {
        // console.log(req.body)
        const Industryarray = req.body.params.Industry
        const isMonetized = req.body.params.Monetized === "" ? "" : req.body.params.Monetized === "true" ? true : false
        const MinpriceValue = req.body.params.Minprice === "" ? 0 : parseInt(req.body.params.Minprice)
        const MaxpriceValue = req.body.params.Maxprice === "" ? 0 : parseInt(req.body.params.Maxprice)
        const sortBy = req.body.params.sort
        let pipline = [];
        pipline.push({
            $match: {
                $and: [
                    Industryarray.length > 0 ? { Industry: { $in: Industryarray } } : {},
                    {
                        $and: [
                            isMonetized ? { Monetized: isMonetized } : {},
                            { Minprice: { $gte: MinpriceValue } },
                            MaxpriceValue !== 0 ? { Maxprice: { $lte: MaxpriceValue } } : {}
                        ]
                    }
                ]
            }
        },
            {
                $lookup: {
                    from: "userModel",
                    localField: "Uid",
                    foreignField: "Uid",
                    as: "Followers"
                }

            }
        )
        pipline.push({
            $project: {
                originalFields: "$$ROOT",
                Viewedcount: { $size: "$Vieweduser" },
                _id:0
            }
        })
        if (sortBy == "Viewcount low to high") {
            pipline.push({
                $sort: {
                    Viewedcount: 1
                }
            })
        }
        else if (sortBy == "Viewcount high to low") {
            pipline.push({
                $sort: {
                    Viewedcount: -1
                }
            })
        }else if (sortBy === "low to high") {
            pipline.push({
                $sort: {
                    Maxprice: -1
                }
            })
        }
        else if (sortBy == "high to low") {
            pipline.push({
                $sort: {
                    Maxprice: 1
                }
            })
        }
        const result = await projectModel.aggregate(pipline)
        // console.log(result.length);
        res.status(200).json({result})
    } catch (err) {
        console.log(err)
    }
    // console.log(req.body)
}
module.exports = {
    getTopLiked,
    getDistinctIndustry,
    getData
}
// {
//     $sort: {
//         $switch: {
//             branches: [
//                 { case: { $eq: [sortBy, "Viewcount"] }, then: { $size: "$Vieweduser" } },
//                 // { case: { $eq: [sortBy, "Followercount"] }, then: "$FollowersCount" },
//                 { case: { $eq: [sortBy, "low to high"] }, then: "$Maxprice" },
//                 { case: { $eq: [sortBy, "high to low"] }, then: { $multiply: ["$Maxprice", -1] } }
//             ],
//             default: 0
//         }
//     }
// },
// {
//     $project: {
//         originalFields: "$$ROOT",
//         Followers: 1
//     }
// }