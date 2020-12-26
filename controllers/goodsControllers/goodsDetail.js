const { Goods, GoodsImage, Comment } = require('../../models');

module.exports = async (req, res) => {
  console.log('id 확인',req.params.id)

  const leftJoinTest = await Goods.findAll({
    include: [
      {
        model: GoodsImage,
        required: false,
        attributes: ['imagePath'],
        where: {
          goodsId: req.params.id,
        },
      },
      {
        model: Comment,
        required: false,
        attributes: ['userId', 'commentMessage', 'createdAt'],
        where: {
          goodsId: req.params.id,
        }
      },
    ],
    where: {
      id: req.params.id,
    },
  }) // 여기까진 데이터 불러오기 성공
  
  // task : comment에서 userId 받아온 걸로 user테이블에서 유저 닉네임 찾아서 클라이언트에게 보내줘야 함

  let [ goods ] = leftJoinTest;
  console.log(goods);
}