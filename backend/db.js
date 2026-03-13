const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'petgo.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    pet TEXT NOT NULL,
    category TEXT NOT NULL,
    price INTEGER NOT NULL,
    description TEXT,
    img TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS rides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pickup TEXT NOT NULL,
    pickup_lat REAL,
    pickup_lon REAL,
    destination TEXT,
    dest_lat REAL,
    dest_lon REAL,
    pet_type TEXT,
    pet_count INTEGER DEFAULT 1,
    service TEXT,
    price INTEGER,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ambulance_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pickup TEXT NOT NULL,
    pickup_lat REAL,
    pickup_lon REAL,
    destination TEXT,
    dest_lat REAL,
    dest_lon REAL,
    animal_size TEXT DEFAULT 'medium',
    oxygen_support INTEGER DEFAULT 0,
    emergency_note TEXT,
    status TEXT DEFAULT 'dispatched',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    items TEXT NOT NULL,
    total INTEGER NOT NULL,
    status TEXT DEFAULT 'placed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS newsletter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed products if table is empty
const count = db.prepare('SELECT COUNT(*) as c FROM products').get();
if (count.c === 0) {
  const products = [
    { name: "Pedigree Chicken & Vegetables Adult Dog Dry Food", pet: "dog", category: "food", price: 1977, desc: "Complete and balanced dog food for adult dogs with 20% protein", img: "product_images/dog_food_pedigree.jpg" },
    { name: "Puppy Food", pet: "dog", category: "food", price: 700, desc: "Nutritious formula for puppies eating from a bowl", img: "product_images/dog_puppy_food.jpg" },
    { name: "Dog Biscuits", pet: "dog", category: "food", price: 180, desc: "Crunchy bone-shaped biscuits in a bowl", img: "product_images/dog_biscuits.jpg" },
    { name: "Dog Leash", pet: "dog", category: "accessories", price: 250, desc: "Durable reinforced nylon leash for safe walks", img: "product_images/dog_leash.jpg" },
    { name: "Dog Collar", pet: "dog", category: "accessories", price: 200, desc: "Adjustable premium nylon collar with secure buckle", img: "product_images/dog_collar.jpg" },
    { name: "Dog Harness", pet: "dog", category: "accessories", price: 450, desc: "Padded no-pull comfortable body harness", img: "product_images/dog_harness.jpg" },
    { name: "Dog Bed", pet: "dog", category: "accessories", price: 900, desc: "Soft and cozy orthopedic sleeping bed", img: "product_images/dog_bed.jpg" },
    { name: "Dog Chew Toy", pet: "dog", category: "accessories", price: 300, desc: "Durable non-toxic rubber chew toy", img: "product_images/dog_chew_toy.jpg" },
    { name: "Whiskas Ocean Fish Adult Cat Dry Food", pet: "cat", category: "food", price: 941, desc: "Nutritious dry food with crunchy kibble", img: "product_images/cat_food_whiskas.jpg" },
    { name: "Cat Wet Food", pet: "cat", category: "food", price: 50, desc: "Premium canned cat food served in a bowl", img: "product_images/cat_wet_food.jpg" },
    { name: "Cat Treats", pet: "cat", category: "food", price: 200, desc: "Irresistible snacks held near a cat", img: "product_images/cat_treats.jpg" },
    { name: "Cat Litter Box", pet: "cat", category: "accessories", price: 450, desc: "Easy to clean litter box filled with litter", img: "product_images/cat_litter_box.jpg" },
    { name: "Cat Litter Sand", pet: "cat", category: "accessories", price: 350, desc: "Ultra-clumping odor control sand", img: "product_images/cat_litter_sand.jpg" },
    { name: "Cat Scratching Post", pet: "cat", category: "accessories", price: 1200, desc: "Durable sisal post for scratching", img: "product_images/cat_scratching_post.jpg" },
    { name: "Cat Feather Toy", pet: "cat", category: "accessories", price: 150, desc: "Cat playing with a teaser feather toy", img: "product_images/cat_feather_toy.jpg" },
    { name: "Cat Bed", pet: "cat", category: "accessories", price: 700, desc: "Plush calming donut bed for cat sleeping", img: "product_images/cat_bed.jpg" },
    { name: "Bird Seed Mix", pet: "bird", category: "food", price: 400, desc: "Bowl of high-quality mixed bird seeds", img: "product_images/bird_seed_mix.jpg" },
    { name: "Parrot Food Pellets", pet: "bird", category: "food", price: 350, desc: "Nutrient-rich pellets eaten by a parrot", img: "product_images/bird_parrot_pellets.jpg" },
    { name: "Bird Cage", pet: "bird", category: "accessories", price: 1500, desc: "Spacious sturdy cage with bird", img: "product_images/bird_cage.jpg" },
    { name: "Bird Swing Toy", pet: "bird", category: "accessories", price: 200, desc: "Bird sitting on a wooden swing toy", img: "product_images/bird_swing_toy.jpg" },
    { name: "Bird Water Dispenser", pet: "bird", category: "accessories", price: 120, desc: "Automatic water feeder for bird cage", img: "product_images/bird_water_dispenser.jpg" },
    { name: "Cuttlefish Bone", pet: "bird", category: "accessories", price: 100, desc: "Essential natural calcium supplement", img: "product_images/bird_cuttlefish_bone.jpg" },
    { name: "Goldfish Food Flakes", pet: "fish", category: "food", price: 350, desc: "Color-enhancing flakes for aquarium", img: "product_images/fish_food_flakes.jpg" },
    { name: "Aquarium Tank", pet: "fish", category: "accessories", price: 3400, desc: "Home aquarium tank with beautiful fish", img: "product_images/fish_aquarium_tank.jpg" },
    { name: "Aquarium Filter", pet: "fish", category: "accessories", price: 600, desc: "Silent filtration system for fish tank", img: "product_images/fish_aquarium_filter.jpg" },
    { name: "Aquarium Air Pump", pet: "fish", category: "accessories", price: 450, desc: "Air pump for aquatic health", img: "product_images/fish_aquarium_air_pump.jpg" },
    { name: "Aquarium Decorative Plants", pet: "fish", category: "accessories", price: 250, desc: "Vibrant artificial plants for aquarium", img: "product_images/fish_aquarium_plants.jpg" },
    { name: "Aquarium LED Light", pet: "fish", category: "accessories", price: 500, desc: "Aquarium with blue LED lighting", img: "product_images/fish_aquarium_light.jpg" },
    { name: "Rabbit Food Pellets", pet: "rabbit", category: "food", price: 350, desc: "Rabbit eating nutritious pellets", img: "product_images/rabbit_food_pellets.jpg" },
    { name: "Timothy Hay", pet: "rabbit", category: "food", price: 489, desc: "Rabbit eating high-fiber premium hay", img: "product_images/rabbit_hay.jpg" },
    { name: "Rabbit Water Bottle", pet: "rabbit", category: "accessories", price: 200, desc: "Water bottle for rabbit cage", img: "product_images/rabbit_water_bottle.jpg" },
    { name: "Rabbit Chew Sticks", pet: "rabbit", category: "accessories", price: 150, desc: "Rabbit chewing natural wood sticks", img: "product_images/rabbit_chew_sticks.jpg" },
    { name: "Rabbit Cage", pet: "rabbit", category: "accessories", price: 2000, desc: "Rabbit inside safe enclosure", img: "product_images/rabbit_cage.jpg" },
    { name: "Hamster Food Mix", pet: "hamster", category: "food", price: 250, desc: "Hamster eating seeds from a bowl", img: "product_images/hamster_food_mix.jpg" },
    { name: "Hamster Cage", pet: "hamster", category: "accessories", price: 3900, desc: "Hamster inside small habitat cage", img: "product_images/hamster_cage.jpg" },
    { name: "Hamster Wheel", pet: "hamster", category: "accessories", price: 250, desc: "Hamster running in exercise wheel", img: "product_images/hamster_wheel.jpg" },
    { name: "Hamster Bedding", pet: "hamster", category: "accessories", price: 300, desc: "Hamster bedding material for nesting", img: "product_images/hamster_bedding.jpg" },
    { name: "Hamster Chew Toy", pet: "hamster", category: "accessories", price: 150, desc: "Hamster chewing small wooden toy", img: "product_images/hamster_chew_toy.jpg" },
    { name: "Turtle Food Pellets", pet: "reptile", category: "food", price: 300, desc: "Turtle eating pellets in tank", img: "product_images/reptile_turtle_pellets.jpg" },
    { name: "Turtle Tank", pet: "reptile", category: "accessories", price: 1800, desc: "Turtle tank with water and rocks", img: "product_images/reptile_turtle_tank.jpg" },
    { name: "UVB Reptile Lamp", pet: "reptile", category: "accessories", price: 5018, desc: "Reptile heat lamp above enclosure", img: "product_images/reptile_uvb_lamp.jpg" },
    { name: "Reptile Heat Lamp", pet: "reptile", category: "accessories", price: 1200, desc: "Reptile basking under heat lamp", img: "product_images/reptile_heat_lamp.jpg" },
    { name: "Reptile Water Dish", pet: "reptile", category: "accessories", price: 250, desc: "Reptile drinking from water dish", img: "product_images/reptile_water_dish.jpg" },
    { name: "Pet Shampoo", pet: "other", category: "accessories", price: 350, desc: "Bottle of pet shampoo next to a dog", img: "product_images/care_shampoo.jpg" },
    { name: "Pet Grooming Brush", pet: "other", category: "accessories", price: 300, desc: "Brushing dog fur with a brush", img: "product_images/care_brush.jpg" },
    { name: "Pet Nail Clipper", pet: "other", category: "accessories", price: 200, desc: "Trimming dog nails with a clipper", img: "product_images/care_nail_clipper.jpg" },
    { name: "Flea & Tick Spray", pet: "other", category: "accessories", price: 450, desc: "Applying flea treatment protection", img: "product_images/care_flea_spray.jpg" },
    { name: "Pet Travel Carrier", pet: "other", category: "accessories", price: 1200, desc: "Dog inside travel carrier crate", img: "product_images/care_travel_carrier.jpg" },
    { name: "Pet First Aid Kit", pet: "other", category: "accessories", price: 600, desc: "Medical kit with bandages and tools", img: "product_images/care_first_aid_kit.jpg" },
    { name: "Pet Cleaning Wipes", pet: "other", category: "accessories", price: 250, desc: "Cleaning pet paws with wipes", img: "product_images/care_cleaning_wipes.jpg" },
  ];

  const insert = db.prepare('INSERT INTO products (name, pet, category, price, description, img) VALUES (?, ?, ?, ?, ?, ?)');
  const seedAll = db.transaction(() => {
    for (const p of products) {
      insert.run(p.name, p.pet, p.category, p.price, p.desc, p.img);
    }
  });
  seedAll();
  console.log(`✅ Seeded ${products.length} products into database`);
}

module.exports = db;
