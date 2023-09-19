import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Admin user',
      email: 'admin@example.com',
      password: bcrypt.hashSync('1234545'),
      isAdmin: true,
    },
    {
      name: 'Normal user',
      email: 'normal_user@example.com',
      password: bcrypt.hashSync('125487'),
      isAdmin: false,
    },
  ],
  // category: [
  //   {
  //     user: '63b16cc6a72046ff5c49f9ea',
  //     name: 'shirts',
  //     slug: 'shirts',
  //     image: '/images/jeans/jeans-1.jpg',
  //     description: 'this is a test and dummy category',
  //   },
  //   {
  //     user: '63b16cc6a72046ff5c49f9ea',
  //     name: 'electronics',
  //     slug: 'electronics',
  //     image: '/images/jeans/jeans-1.jpg',
  //     description: 'this is a test and dummy category',
  //   },
  //   {
  //     user: '63b16cc6a72046ff5c49f9ea',
  //     name: 'pants',
  //     slug: 'pants',
  //     image: '/images/jeans/jeans-2.jpg',
  //     description: 'this is a test and dummy category 2',
  //   },
  // ],

  // subcategory: [
  //   {
  //     name: 'girls',
  //     slug: 'girls',
  //   },
  //   {
  //     name: 'boys',
  //     slug: 'boys',
  //   },
  // ],

  // products: [
  //   {
  //     title: `Legendary Whitetails Men's Buck Camp Flannel Shirt`,
  //     slug: 'legendary-whitetails-mans-buck-camp-flannel-shirt',
  //     shortDescription: `Our signature corduroy lined collar and cuffs not only look cool, but add stability.`,
  //     description: `100% Cotton
  //       Imported
  //       Button closure
  //       Machine Wash
  //       PERFECT WEIGHT: Weighing in at 5.1 ounces, the Buck Camp Flannel Shirt is the perfect weight to be worn alone or layered, indoors or outside; you're gonna love this comfortable brushed cotton flannel shirt
  //      `,
  //     price: 70,
  //     category: '63b16d3ca72046ff5c49fa10',
  //     subcategory: '63b16d3ca72046ff5c49fa13',
  //     images: '/images/shirts/shirts-1.jpg',
  //     shipping: 'No',
  //     color: 'white',
  //     brand: 'Nike',
  //     ratings: [
  //       {
  //         star: 3.5,
  //         postedBy: '63921a776c82a1fb0293d47b',
  //       },
  //     ],
  //     size: 'XXL',
  //     numReviews: 10,
  //     countInStock: 20,
  //     sold: 12,
  //   },
  //   {
  //     title: `Whitetails Men's Buck Camp Flannel Shirt`,
  //     slug: 'whitetails-mans-buck-camp-flannel-shirt',
  //     shortDescription: `Our signature corduroy lined collar and cuffs not only look cool, but add stability.`,
  //     description: `100% Cotton
  //       Imported
  //       Button closure
  //       Machine Wash
  //       PERFECT WEIGHT: Weighing in at 5.1 ounces, the Buck Camp Flannel Shirt is the perfect weight to be worn alone or layered, indoors or outside; you're gonna love this comfortable brushed cotton flannel shirt
  //      `,
  //     price: 70,
  //     category: '63b16d3ca72046ff5c49fa10',
  //     subcategory: '63b16d3ca72046ff5c49fa13',
  //     images: '/images/shirts/shirts-1.jpg',
  //     shipping: 'No',
  //     color: 'white',
  //     brand: 'Nike',
  //     ratings: [
  //       {
  //         star: 4.5,
  //         postedBy: '63921a776c82a1fb0293d47b',
  //       },
  //     ],
  //     size: 'XXL',
  //     numReviews: 10,
  //     countInStock: 15,
  //     sold: 12,
  //   },
  //   {
  //     title: `Men's Buck Camp Flannel Shirt`,
  //     slug: 'mans-buck-camp-flannel-shirt',
  //     shortDescription: `Our signature corduroy lined collar and cuffs not only look cool, but add stability.`,
  //     description: `100% Cotton
  //       Imported
  //       Button closure
  //       Machine Wash
  //       PERFECT WEIGHT: Weighing in at 5.1 ounces, the Buck Camp Flannel Shirt is the perfect weight to be worn alone or layered, indoors or outside; you're gonna love this comfortable brushed cotton flannel shirt
  //      `,
  //     price: 70,
  //     category: '63b16d3ca72046ff5c49fa10',
  //     subcategory: '63b16d3ca72046ff5c49fa13',
  //     images: '/images/shirts/shirts-1.jpg',
  //     shipping: 'No',
  //     color: 'white',
  //     brand: 'Nike',
  //     ratings: [
  //       {
  //         star: 4,
  //         postedBy: '63921a776c82a1fb0293d47b',
  //       },
  //     ],
  //     size: 'XXL',
  //     numReviews: 10,
  //     countInStock: 0,
  //     sold: 12,
  //   },
  // ],
};
export default data;
