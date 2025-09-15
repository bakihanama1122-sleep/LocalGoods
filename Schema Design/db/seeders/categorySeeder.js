const Category = require('../../models/Category');  // Changed from '../models/Category'

const categories = [
  {
    name: 'Handicrafts',
    description: 'Traditional and modern handicraft items',
    subcategories: [
      { name: 'Pottery & Ceramics', description: 'Handmade pottery and ceramic items' },
      { name: 'Textiles & Fabrics', description: 'Traditional textiles and fabric items' },
      { name: 'Wood Crafts', description: 'Wooden handicraft items' },
      { name: 'Metal Works', description: 'Metal handicraft and decorative items' }
    ]
  },
  {
    name: 'Antiques',
    description: 'Authentic antique items with historical value',
    subcategories: [
      { name: 'Furniture', description: 'Antique furniture pieces' },
      { name: 'Coins & Currency', description: 'Historical coins and currency' },
      { name: 'Jewelry', description: 'Vintage and antique jewelry' },
      { name: 'Books & Manuscripts', description: 'Rare books and historical manuscripts' },
      { name: 'Art & Paintings', description: 'Antique art pieces and paintings' }
    ]
  },
  {
    name: 'Traditional Clothing',
    description: 'Regional and traditional clothing items',
    subcategories: [
      { name: 'Sarees & Silk', description: 'Traditional sarees and silk wear' },
      { name: 'Ethnic Wear', description: 'Regional traditional clothing' },
      { name: 'Accessories', description: 'Traditional accessories and ornaments' }
    ]
  },
  {
    name: 'Home Decor',
    description: 'Decorative items for home',
    subcategories: [
      { name: 'Wall Art', description: 'Decorative wall art and hangings' },
      { name: 'Sculptures', description: 'Decorative sculptures and figurines' },
      { name: 'Lamps & Lighting', description: 'Traditional lamps and lighting items' }
    ]
  },
  {
    name: 'Musical Instruments',
    description: 'Traditional and regional musical instruments',
    subcategories: [
      { name: 'String Instruments', description: 'Traditional string instruments' },
      { name: 'Percussion', description: 'Drums and percussion instruments' },
      { name: 'Wind Instruments', description: 'Flutes and wind instruments' }
    ]
  }
];

const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    
    for (const categoryData of categories) {
      // Create parent category
      const parentCategory = new Category({
        name: categoryData.name,
        description: categoryData.description,
        parentId: null
      });
      
      const savedParent = await parentCategory.save();
      console.log(`Created parent category: ${savedParent.name}`);
      
      // Create subcategories
      if (categoryData.subcategories) {
        for (const subcat of categoryData.subcategories) {
          const subcategory = new Category({
            name: subcat.name,
            description: subcat.description,
            parentId: savedParent._id
          });
          
          const savedSub = await subcategory.save();
          console.log(`  Created subcategory: ${savedSub.name}`);
        }
      }
    }
    
    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;  // Re-throw error so it can be caught by the calling function
  }
};

module.exports = { seedCategories, categories };