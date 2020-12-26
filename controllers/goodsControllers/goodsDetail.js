const { Goods, GoodsImage } = require('../../models');

module.exports = async (req, res) => {
  console.log('id 확인',req.params.id)

  const leftJoinTest = await Goods.findAll({
    include: [
      {
        model: GoodsImage,
        required: false,
        where: {
          id: req.params.id,
        },
        // attributes: ['username'],
      }
      // {
      //   model: locations,
      //   required: false,
      //   attributes: ['location1', 'location2', 'location3', 'location4', 'location5'],
      // }, // 2중 조인
    ]
  })

  console.log(leftJoinTest);
}