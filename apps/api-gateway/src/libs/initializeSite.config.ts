import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initializeSiteConfig = async () => {
  try {
    const existingConfig = await prisma.site_config.findFirst();
    if (!existingConfig) {
      await prisma.site_config.create({
        data: {
          categories: [
            "Handicrafts",
            "Vintage Furniture",
            "Artifacts",
            "Traditional Textiles",
            "Handmade Jewelry",
            "Pottery & Ceramics",
            "Folk Paintings",
            "Collectibles",
            "Woodcrafts",
            "Metal Works",
          ],
          subCategories: {
            Handicrafts: ["Baskets", "Toys", "Decor Items"],
            "Vintage Furniture": [
              "Chairs",
              "Tables",
              "Cupboards",
              "Storage Chests",
            ],
            Artifacts: ["Statues", "Masks", "Ritual Items"],
            "Traditional Textiles": ["Sarees", "Shawls", "Handwoven Fabrics"],
            "Handmade Jewelry": ["Necklaces", "Earrings", "Bracelets", "Rings"],
            "Pottery & Ceramics": [
              "Vases",
              "Bowls",
              "Plates",
              "Decorative Pots",
            ],
            "Folk Paintings": [
              "Madhubani",
              "Warli",
              "Pattachitra",
              "Miniatures",
            ],
            Collectibles: ["Coins", "Stamps", "Old Notes", "Vintage Posters"],
            Woodcrafts: ["Carved Boxes", "Frames", "Sculptures"],
            "Metal Works": ["Brassware", "Copperware", "Silver Items"],
          },
        },
      });
    }
  } catch (error) {
    console.error("error initializing site config:",error);
  }
};

export default initializeSiteConfig;
