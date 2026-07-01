const mongoose = require('mongoose');
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes.');

    // Create a mock user
    const existingUser = await User.findOne({ username: 'neon_chef' });
    let authorId;
    if (existingUser) {
      authorId = existingUser._id;
    } else {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const newUser = await User.create({
        username: 'neon_chef',
        password: hashedPassword,
      });
      authorId = newUser._id;
    }

    // Create mock recipes
    const recipes = [
      {
        title: 'Neon Cyber Ramen',
        ingredients: '- 2 packs of Ramen Noodles\n- Glowing Cyan Broth (Blue Curaçao & Tonic Water base)\n- Marinated Cyber Pork Belly\n- Edible Neon Pink Seaweed\n- 1 Soft Boiled Egg with Soy Marinade',
        instructions: '1. Boil the noodles until perfectly chewy.\n2. In a separate bowl, mix the glowing broth ingredients and heat carefully.\n3. Slice the pork belly thin and sear with a blowtorch for a futuristic charred flavor.\n4. Assemble everything in a sleek black bowl and garnish with neon seaweed.',
        imageUrl: '/images/cyberpunk_ramen.png',
        author: authorId,
      },
      {
        title: 'Galactic Void Donut',
        ingredients: '- 2 cups Flour\n- 1/2 cup Cocoa Powder (Darkest available)\n- Deep Space Glaze (Purple & Cyan food coloring, edible glitter)\n- Sugar Stars for garnish',
        instructions: '1. Mix dry ingredients and bake donuts in the void oven (or standard oven at 350F for 15 mins).\n2. Prepare the glaze by swirling the colors lightly—do not overmix, you want a nebula effect.\n3. Dip the cooled donuts into the glaze and suspend in anti-gravity (or rest on a wire rack).\n4. Sprinkle with stars before the glaze sets.',
        imageUrl: '/images/galaxy_donut.png',
        author: authorId,
      },
      {
        title: 'Dark Matter Charcoal Burger',
        ingredients: '- Activated Charcoal Brioche Buns\n- 8oz Wagyu Beef Patty\n- Electric Cyan Jalapeños\n- Glowing Neon Pink Sauce (Beetroot extract & Mayo base)\n- Aged Cheddar',
        instructions: '1. Toast the charcoal buns until warm.\n2. Smash the patty on a screaming hot griddle. Cook to medium rare.\n3. Layer the aged cheddar and let it melt into the meat.\n4. Assemble the burger, smothering it in the glowing pink sauce and topping with the electric jalapeños.',
        imageUrl: '/images/neon_burger.png',
        author: authorId,
      },
      {
        title: 'Toxic Matcha Lava Cake',
        ingredients: '- 1 cup Dark Chocolate (80% Cocoa)\n- 1/2 cup Butter\n- 2 Eggs + 2 Yolks\n- 1/4 cup Sugar\n- 2 tbsp Flour\n- Neon Green Matcha Ganache for the center',
        instructions: '1. Melt the dark chocolate and butter together until smooth.\n2. Whisk eggs and sugar until pale and fluffy. Fold into the chocolate mixture.\n3. Add flour and fold gently.\n4. Pour half the batter into ramekins, add a dollop of matcha ganache, then cover with the rest of the batter.\n5. Bake at 400F for 12 minutes. Serve immediately and watch it ooze.',
        imageUrl: '/images/matcha_lava.png',
        author: authorId,
      }
    ];

    await Recipe.insertMany(recipes);
    console.log('Seeded 4 aesthetic mock recipes!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
