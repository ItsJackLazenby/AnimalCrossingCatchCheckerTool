import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PGlite } from '@electric-sql/pglite';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export type Category = 'fish' | 'bugs' | 'sea' | 'fossils';

export interface CatchableItem {
  id: number;
  name: string;
  category: Category;
  location?: string;
  price: number;
  caught: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: '../styles.css'
})
export class App implements OnInit {
  private db!: PGlite;
  private readonly TAB_STORAGE_KEY = 'stevo_ac_active_tab';

  isLoading = signal<boolean>(true);
  activeTab = signal<Category>(
    (localStorage.getItem(this.TAB_STORAGE_KEY) as Category) || 'fish'
  );
  items = signal<CatchableItem[]>([]);
  searchQuery = signal<string>('');

  filteredItems = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const currentTab = this.activeTab();
    return this.items().filter(
      (item) => item.category === currentTab && item.name.toLowerCase().includes(q)
    );
  });

  tabCaughtCount = computed(() =>
    this.items().filter((i) => i.category === this.activeTab() && i.caught).length
  );

  tabTotalCount = computed(() =>
    this.items().filter((i) => i.category === this.activeTab()).length
  );

  async ngOnInit() {
    try {
      // 1. Initialize PGlite with IndexedDB persistence ('idb://...')
      this.db = new PGlite('idb://ac_tracker_db');

      // 2. Ensure schema exists
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS catch_tracker (
          id INT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          location TEXT,
          price INT NOT NULL,
          caught BOOLEAN DEFAULT FALSE
        );
      `);

      // 3. Seed only if empty (preserves caught status across refreshes)
      await this.seedFullDatabase();
      await this.loadItems();
    } catch (err) {
      console.error('Failed to initialize local database:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async seedFullDatabase() {
    const res = await this.db.query<{ count: number }>('SELECT COUNT(*) as count FROM catch_tracker;');
    if (Number(res.rows[0]?.count ?? 0) === 0) {
      await this.db.exec(`
        INSERT INTO catch_tracker (id, name, category, location, price, caught) VALUES
        -- FISH (80)
        (1, 'Bitterling', 'fish', 'River', 900, false),
        (2, 'Pale Chub', 'fish', 'River', 200, false),
        (3, 'Crucian Carp', 'fish', 'River', 160, false),
        (4, 'Dace', 'fish', 'River', 240, false),
        (5, 'Carp', 'fish', 'Pond', 300, false),
        (6, 'Koi', 'fish', 'Pond', 4000, false),
        (7, 'Goldfish', 'fish', 'Pond', 1300, false),
        (8, 'Pop-eyed Goldfish', 'fish', 'Pond', 1300, false),
        (9, 'Ranchu Goldfish', 'fish', 'Pond', 4500, false),
        (10, 'Killifish', 'fish', 'Pond', 300, false),
        (11, 'Crawfish', 'fish', 'Pond', 200, false),
        (12, 'Soft-shelled Turtle', 'fish', 'River', 3750, false),
        (13, 'Snapping Turtle', 'fish', 'River', 5000, false),
        (14, 'Tadpole', 'fish', 'Pond', 100, false),
        (15, 'Frog', 'fish', 'Pond', 120, false),
        (16, 'Freshwater Goby', 'fish', 'River', 400, false),
        (17, 'Loach', 'fish', 'River', 400, false),
        (18, 'Catfish', 'fish', 'Pond', 800, false),
        (19, 'Giant Channa', 'fish', 'Pond', 5500, false),
        (20, 'Bluegill', 'fish', 'River', 180, false),
        (21, 'Yellow Perch', 'fish', 'River', 300, false),
        (22, 'Black Bass', 'fish', 'River', 400, false),
        (23, 'Tilapia', 'fish', 'River', 800, false),
        (24, 'Pike', 'fish', 'River', 1800, false),
        (25, 'Pond Smelt', 'fish', 'River', 500, false),
        (26, 'Sweetfish', 'fish', 'River', 900, false),
        (27, 'Cherry Salmon', 'fish', 'Clifftop River', 1000, false),
        (28, 'Char', 'fish', 'Clifftop River', 3800, false),
        (29, 'Golden Trout', 'fish', 'Clifftop River', 15000, false),
        (30, 'Stringfish', 'fish', 'Clifftop River', 15000, false),
        (31, 'Salmon', 'fish', 'River Mouth', 700, false),
        (32, 'King Salmon', 'fish', 'River Mouth', 1800, false),
        (33, 'Mitten Crab', 'fish', 'River', 2000, false),
        (34, 'Guppy', 'fish', 'River', 1300, false),
        (35, 'Nibble Fish', 'fish', 'River', 1500, false),
        (36, 'Angelfish', 'fish', 'River', 3000, false),
        (37, 'Betta', 'fish', 'River', 2500, false),
        (38, 'Neon Tetra', 'fish', 'River', 500, false),
        (39, 'Rainbowfish', 'fish', 'River', 800, false),
        (40, 'Piranha', 'fish', 'River', 2500, false),
        (41, 'Arowana', 'fish', 'River', 10000, false),
        (42, 'Dorado', 'fish', 'River', 15000, false),
        (43, 'Gar', 'fish', 'Pond', 6000, false),
        (44, 'Arapaima', 'fish', 'River', 10000, false),
        (45, 'Saddled Bichir', 'fish', 'River', 4000, false),
        (46, 'Sturgeon', 'fish', 'River Mouth', 10000, false),
        (47, 'Sea Butterfly', 'fish', 'Sea', 1000, false),
        (48, 'Seahorse', 'fish', 'Sea', 1100, false),
        (49, 'Clown Fish', 'fish', 'Sea', 650, false),
        (50, 'Surgeonfish', 'fish', 'Sea', 1000, false),
        (51, 'Butterfly Fish', 'fish', 'Sea', 1000, false),
        (52, 'Napoleonfish', 'fish', 'Sea', 10000, false),
        (53, 'Red Snapper', 'fish', 'Sea', 3000, false),
        (54, 'Dab', 'fish', 'Sea', 300, false),
        (55, 'Olive Flounder', 'fish', 'Sea', 800, false),
        (56, 'Squid', 'fish', 'Sea', 500, false),
        (57, 'Moray Eel', 'fish', 'Sea', 2000, false),
        (58, 'Ribbon Eel', 'fish', 'Sea', 600, false),
        (59, 'Tuna', 'fish', 'Pier', 7100, false),
        (60, 'Giant Trevally', 'fish', 'Pier', 4500, false),
        (61, 'Mahi-mahi', 'fish', 'Pier', 6000, false),
        (62, 'Ocean Sunfish', 'fish', 'Sea', 4000, false),
        (63, 'Ray', 'fish', 'Sea', 3000, false),
        (64, 'Saw Shark', 'fish', 'Sea', 12000, false),
        (65, 'Hammerhead Shark', 'fish', 'Sea', 8000, false),
        (66, 'Great White Shark', 'fish', 'Sea', 15000, false),
        (67, 'Whale Shark', 'fish', 'Sea', 13000, false),
        (68, 'Suckerfish', 'fish', 'Sea', 1500, false),
        (69, 'Football Fish', 'fish', 'Sea', 2500, false),
        (70, 'Oarfish', 'fish', 'Sea', 9000, false),
        (71, 'Barreleye', 'fish', 'Sea', 15000, false),
        (72, 'Coelacanth', 'fish', 'Sea (Rainy)', 15000, false),
        (73, 'Anchovy', 'fish', 'Sea', 200, false),
        (74, 'Horse Mackerel', 'fish', 'Sea', 150, false),
        (75, 'Barred Knifejaw', 'fish', 'Sea', 5000, false),
        (76, 'Sea Bass', 'fish', 'Sea', 400, false),
        (77, 'Blowfish', 'fish', 'Sea', 1250, false),
        (78, 'Puffer Fish', 'fish', 'Sea', 250, false),
        (79, 'Whitespotted Char', 'fish', 'Clifftop River', 3800, false),
        (80, 'Zebra Turkeyfish', 'fish', 'Sea', 500, false),

        -- BUGS (80)
        (101, 'Common Butterfly', 'bugs', 'Flying', 160, false),
        (102, 'Yellow Butterfly', 'bugs', 'Flying', 160, false),
        (103, 'Tiger Butterfly', 'bugs', 'Flying', 240, false),
        (104, 'Peacock Butterfly', 'bugs', 'Flying Near Hybrid Flowers', 2500, false),
        (105, 'Common Bluebutterfly', 'bugs', 'Flying', 140, false),
        (106, 'Paper Kite Butterfly', 'bugs', 'Flying', 1000, false),
        (107, 'Great Purple Emperor', 'bugs', 'Flying', 3000, false),
        (108, 'Monarch Butterfly', 'bugs', 'Flying', 140, false),
        (109, 'Emperor Butterfly', 'bugs', 'Flying', 4000, false),
        (110, 'Agrias Butterfly', 'bugs', 'Flying', 3000, false),
        (111, 'Raja Brooke Birdwing', 'bugs', 'Flying Near Water', 2500, false),
        (112, 'Queen Alexandra Birdwing', 'bugs', 'Flying', 4000, false),
        (113, 'Moth', 'bugs', 'Flying Near Lights', 130, false),
        (114, 'Atlas Moth', 'bugs', 'On Trees', 3000, false),
        (115, 'Madagascan Sunset Moth', 'bugs', 'Flying', 2500, false),
        (116, 'Long Locust', 'bugs', 'On the Ground', 200, false),
        (117, 'Rice Grasshopper', 'bugs', 'On the Ground', 160, false),
        (118, 'Grasshopper', 'bugs', 'On the Ground', 160, false),
        (119, 'Cricket', 'bugs', 'On the Ground', 130, false),
        (120, 'Bell Cricket', 'bugs', 'On the Ground', 430, false),
        (121, 'Mantis', 'bugs', 'On Flowers', 430, false),
        (122, 'Orchid Mantis', 'bugs', 'On White Flowers', 2400, false),
        (123, 'Honeybee', 'bugs', 'Flying', 200, false),
        (124, 'Wasp', 'bugs', 'Shaking Trees', 2500, false),
        (125, 'Brown Cicada', 'bugs', 'On Trees', 250, false),
        (126, 'Robust Cicada', 'bugs', 'On Trees', 300, false),
        (127, 'Giant Cicada', 'bugs', 'On Trees', 500, false),
        (128, 'Walker Cicada', 'bugs', 'On Trees', 400, false),
        (129, 'Evening Cicada', 'bugs', 'On Trees', 550, false),
        (130, 'Cicada Shell', 'bugs', 'On Trees', 10, false),
        (131, 'Red Dragonfly', 'bugs', 'Flying', 180, false),
        (132, 'Darner Dragonfly', 'bugs', 'Flying', 230, false),
        (133, 'Banded Dragonfly', 'bugs', 'Flying', 4500, false),
        (134, 'Damselfly', 'bugs', 'Flying', 500, false),
        (135, 'Firefly', 'bugs', 'Flying Near Water', 300, false),
        (136, 'Mole Cricket', 'bugs', 'Underground', 500, false),
        (137, 'Pondskater', 'bugs', 'On Ponds', 130, false),
        (138, 'Diving Beetle', 'bugs', 'On Ponds & Rivers', 800, false),
        (139, 'Giant Water Bug', 'bugs', 'On Rivers', 2000, false),
        (140, 'Stinkbug', 'bugs', 'On Flowers', 120, false),
        (141, 'Man-faced Stink Bug', 'bugs', 'On Flowers', 1000, false),
        (142, 'Ladybug', 'bugs', 'On Flowers', 200, false),
        (143, 'Tiger Beetle', 'bugs', 'On the Ground', 1500, false),
        (144, 'Jewel Beetle', 'bugs', 'On Tree Stumps', 2400, false),
        (145, 'Violin Beetle', 'bugs', 'On Tree Stumps', 450, false),
        (146, 'Citrus Long-horned Beetle', 'bugs', 'On Tree Stumps', 350, false),
        (147, 'Rosalia Batesi Beetle', 'bugs', 'On Tree Stumps', 3000, false),
        (148, 'Blue Weevil Beetle', 'bugs', 'On Coconut Palms', 800, false),
        (149, 'Dung Beetle', 'bugs', 'Rolling Snowballs', 3000, false),
        (150, 'Earth-boring Dung Beetle', 'bugs', 'On the Ground', 300, false),
        (151, 'Scarab Beetle', 'bugs', 'On Trees', 10000, false),
        (152, 'Drone Beetle', 'bugs', 'On Trees', 200, false),
        (153, 'Goliath Beetle', 'bugs', 'On Coconut Palms', 8000, false),
        (154, 'Saw Stag', 'bugs', 'On Trees', 2000, false),
        (155, 'Miyama Stag', 'bugs', 'On Trees', 1000, false),
        (156, 'Giant Stag', 'bugs', 'On Trees', 10000, false),
        (157, 'Rainbow Stag', 'bugs', 'On Trees', 6000, false),
        (158, 'Cyclommatus Stag', 'bugs', 'On Coconut Palms', 8000, false),
        (159, 'Golden Stag', 'bugs', 'On Coconut Palms', 12000, false),
        (160, 'Giraffe Stag', 'bugs', 'On Coconut Palms', 12000, false),
        (161, 'Horned Dynastid', 'bugs', 'On Trees', 1350, false),
        (162, 'Horned Atlas', 'bugs', 'On Coconut Palms', 8000, false),
        (163, 'Horned Elephant', 'bugs', 'On Coconut Palms', 8000, false),
        (164, 'Horned Hercules', 'bugs', 'On Coconut Palms', 12000, false),
        (165, 'Walking Stick', 'bugs', 'On Trees', 600, false),
        (166, 'Walking Leaf', 'bugs', 'Under Trees (As Furniture)', 600, false),
        (167, 'Bagworm', 'bugs', 'Shaking Trees', 600, false),
        (168, 'Ant', 'bugs', 'On Spoiled Turnips', 80, false),
        (169, 'Hermit Crab', 'bugs', 'On Beach (Disguised)', 1000, false),
        (170, 'Wharf Roach', 'bugs', 'On Beach Rocks', 200, false),
        (171, 'Fly', 'bugs', 'Near Trash/Rotten Food', 60, false),
        (172, 'Mosquito', 'bugs', 'Flying', 130, false),
        (173, 'Flea', 'bugs', 'On Villagers', 70, false),
        (174, 'Snail', 'bugs', 'On Rocks (When Raining)', 250, false),
        (175, 'Pill Bug', 'bugs', 'Hitting Rocks', 250, false),
        (176, 'Centipede', 'bugs', 'Hitting Rocks', 300, false),
        (177, 'Spider', 'bugs', 'Shaking Trees', 600, false),
        (178, 'Tarantula', 'bugs', 'On the Ground', 8000, false),
        (179, 'Scorpion', 'bugs', 'On the Ground', 8000, false),
        (180, 'Resplendent Stag', 'bugs', 'On Trees', 10000, false),

        -- SEA CREATURES (40)
        (201, 'Sea Cucumber', 'sea', 'Ocean Floor', 500, false),
        (202, 'Sea Star', 'sea', 'Ocean Floor', 500, false),
        (203, 'Sea Urchin', 'sea', 'Ocean Floor', 1700, false),
        (204, 'Slate Pencil Urchin', 'sea', 'Ocean Floor', 2000, false),
        (205, 'Sea Anemone', 'sea', 'Ocean Floor', 500, false),
        (206, 'Moon Jellyfish', 'sea', 'Ocean Floor', 600, false),
        (207, 'Sea Slug', 'sea', 'Ocean Floor', 600, false),
        (208, 'Pearl Oyster', 'sea', 'Ocean Floor', 2800, false),
        (209, 'Mussel', 'sea', 'Ocean Floor', 1500, false),
        (210, 'Oyster', 'sea', 'Ocean Floor', 2000, false),
        (211, 'Scallop', 'sea', 'Ocean Floor', 1200, false),
        (212, 'Whelk', 'sea', 'Ocean Floor', 1000, false),
        (213, 'Turban Shell', 'sea', 'Ocean Floor', 1000, false),
        (214, 'Abalone', 'sea', 'Ocean Floor', 2000, false),
        (215, 'Gigas Giant Clam', 'sea', 'Ocean Floor', 15000, false),
        (216, 'Chambered Nautilus', 'sea', 'Ocean Floor', 1800, false),
        (217, 'Octopus', 'sea', 'Ocean Floor', 1200, false),
        (218, 'Umbrella Octopus', 'sea', 'Ocean Floor', 6000, false),
        (219, 'Vampire Squid', 'sea', 'Ocean Floor', 10000, false),
        (220, 'Firefly Squid', 'sea', 'Ocean Floor', 1400, false),
        (221, 'Gazami Crab', 'sea', 'Ocean Floor', 2200, false),
        (222, 'Dungeness Crab', 'sea', 'Ocean Floor', 1900, false),
        (223, 'Snow Crab', 'sea', 'Ocean Floor', 6000, false),
        (224, 'Red King Crab', 'sea', 'Ocean Floor', 8000, false),
        (225, 'Spider Crab', 'sea', 'Ocean Floor', 12000, false),
        (226, 'Tiger Prawn', 'sea', 'Ocean Floor', 3000, false),
        (227, 'Sweet Shrimp', 'sea', 'Ocean Floor', 1400, false),
        (228, 'Mantis Shrimp', 'sea', 'Ocean Floor', 2500, false),
        (229, 'Spiny Lobster', 'sea', 'Ocean Floor', 5000, false),
        (230, 'Lobster', 'sea', 'Ocean Floor', 4500, false),
        (231, 'Giant Isopod', 'sea', 'Ocean Floor', 12000, false),
        (232, 'Horseshoe Crab', 'sea', 'Ocean Floor', 2500, false),
        (233, 'Sea Pineapple', 'sea', 'Ocean Floor', 1500, false),
        (234, 'Spotted Garden Eel', 'sea', 'Ocean Floor', 1100, false),
        (235, 'Flatworm', 'sea', 'Ocean Floor', 700, false),
        (236, 'Venus Flower Basket', 'sea', 'Ocean Floor', 5000, false),
        (237, 'Sea Pig', 'sea', 'Ocean Floor', 10000, false),
        (238, 'Sea Pen', 'sea', 'Ocean Floor', 500, false),
        (239, 'Crown-of-Thorns Starfish', 'sea', 'Ocean Floor', 1700, false),
        (240, 'Acorn Barnacle', 'sea', 'Ocean Floor', 600, false),

        -- FOSSILS (73)
        (301, 'Achelousaurus Skull', 'fossils', 'Buried Ground', 4000, false),
        (302, 'Achelousaurus Torso', 'fossils', 'Buried Ground', 3500, false),
        (303, 'Achelousaurus Tail', 'fossils', 'Buried Ground', 3000, false),
        (304, 'Akanthostega', 'fossils', 'Buried Ground', 2000, false),
        (305, 'Amber', 'fossils', 'Buried Ground', 1200, false),
        (306, 'Ammonite', 'fossils', 'Buried Ground', 1100, false),
        (307, 'Ankylosaurus Skull', 'fossils', 'Buried Ground', 3500, false),
        (308, 'Ankylosaurus Torso', 'fossils', 'Buried Ground', 3000, false),
        (309, 'Ankylosaurus Tail', 'fossils', 'Buried Ground', 2500, false),
        (310, 'Anomalocaris', 'fossils', 'Buried Ground', 2000, false),
        (311, 'Archaeopteryx', 'fossils', 'Buried Ground', 1300, false),
        (312, 'Archelon Skull', 'fossils', 'Buried Ground', 4000, false),
        (313, 'Archelon Tail', 'fossils', 'Buried Ground', 3500, false),
        (314, 'Australopithecus', 'fossils', 'Buried Ground', 1100, false),
        (315, 'Brachiosaurus Skull', 'fossils', 'Buried Ground', 5500, false),
        (316, 'Brachiosaurus Chest', 'fossils', 'Buried Ground', 5500, false),
        (317, 'Brachiosaurus Pelvis', 'fossils', 'Buried Ground', 5000, false),
        (318, 'Brachiosaurus Tail', 'fossils', 'Buried Ground', 5000, false),
        (319, 'Coprolite', 'fossils', 'Buried Ground', 1100, false),
        (320, 'Deinonychus Skull', 'fossils', 'Buried Ground', 3000, false),
        (321, 'Deinonychus Tail', 'fossils', 'Buried Ground', 2500, false),
        (322, 'Dimetrodon Skull', 'fossils', 'Buried Ground', 5500, false),
        (323, 'Dimetrodon Torso', 'fossils', 'Buried Ground', 5000, false),
        (324, 'Dunkleosteus', 'fossils', 'Buried Ground', 3500, false),
        (325, 'Eusthenopteron', 'fossils', 'Buried Ground', 2000, false),
        (326, 'Iguanodon Skull', 'fossils', 'Buried Ground', 4000, false),
        (327, 'Iguanodon Torso', 'fossils', 'Buried Ground', 3500, false),
        (328, 'Iguanodon Tail', 'fossils', 'Buried Ground', 3000, false),
        (329, 'Juramaia', 'fossils', 'Buried Ground', 1500, false),
        (330, 'Mammoth Skull', 'fossils', 'Buried Ground', 3000, false),
        (331, 'Mammoth Torso', 'fossils', 'Buried Ground', 2500, false),
        (332, 'Megacerops Skull', 'fossils', 'Buried Ground', 4500, false),
        (333, 'Megacerops Torso', 'fossils', 'Buried Ground', 4000, false),
        (334, 'Megacerops Tail', 'fossils', 'Buried Ground', 3500, false),
        (335, 'Ophthalmosaurus Skull', 'fossils', 'Buried Ground', 2500, false),
        (336, 'Ophthalmosaurus Torso', 'fossils', 'Buried Ground', 2000, false),
        (337, 'Pachycephalosaurus Skull', 'fossils', 'Buried Ground', 4000, false),
        (338, 'Pachycephalosaurus Tail', 'fossils', 'Buried Ground', 3500, false),
        (339, 'Parasaurolophus Skull', 'fossils', 'Buried Ground', 3500, false),
        (340, 'Parasaurolophus Torso', 'fossils', 'Buried Ground', 3000, false),
        (341, 'Parasaurolophus Tail', 'fossils', 'Buried Ground', 2500, false),
        (342, 'Plesiosaurus Skull', 'fossils', 'Buried Ground', 4000, false),
        (343, 'Plesiosaurus Body', 'fossils', 'Buried Ground', 4500, false),
        (344, 'Plesiosaurus Tail', 'fossils', 'Buried Ground', 4000, false),
        (345, 'Pteranodon Skull', 'fossils', 'Buried Ground', 4000, false),
        (346, 'Pteranodon Left Wing', 'fossils', 'Buried Ground', 4500, false),
        (347, 'Pteranodon Right Wing', 'fossils', 'Buried Ground', 4500, false),
        (348, 'Quetzalcoatlus Skull', 'fossils', 'Buried Ground', 4500, false),
        (349, 'Quetzalcoatlus Torso', 'fossils', 'Buried Ground', 4500, false),
        (350, 'Quetzalcoatlus Right Wing', 'fossils', 'Buried Ground', 5000, false),
        (351, 'Sabertooth Skull', 'fossils', 'Buried Ground', 2500, false),
        (352, 'Sabertooth Tail', 'fossils', 'Buried Ground', 2000, false),
        (353, 'Shark-tooth Pattern', 'fossils', 'Buried Ground', 1000, false),
        (354, 'Spinosaurus Skull', 'fossils', 'Buried Ground', 4000, false),
        (355, 'Spinosaurus Torso', 'fossils', 'Buried Ground', 3000, false),
        (356, 'Spinosaurus Tail', 'fossils', 'Buried Ground', 2500, false),
        (357, 'Stegosaurus Skull', 'fossils', 'Buried Ground', 5000, false),
        (358, 'Stegosaurus Torso', 'fossils', 'Buried Ground', 4500, false),
        (359, 'Stegosaurus Tail', 'fossils', 'Buried Ground', 4000, false),
        (360, 'T. rex Skull', 'fossils', 'Buried Ground', 6000, false),
        (361, 'T. rex Torso', 'fossils', 'Buried Ground', 5500, false),
        (362, 'T. rex Tail', 'fossils', 'Buried Ground', 5000, false),
        (363, 'Triceratops Skull', 'fossils', 'Buried Ground', 5500, false),
        (364, 'Triceratops Torso', 'fossils', 'Buried Ground', 5000, false),
        (365, 'Triceratops Tail', 'fossils', 'Buried Ground', 4500, false),
        (366, 'Trilobite', 'fossils', 'Buried Ground', 1300, false),
        (367, 'Myllokunmingia', 'fossils', 'Buried Ground', 1500, false),
        (368, 'Diplodocus Skull', 'fossils', 'Buried Ground', 5000, false),
        (369, 'Diplodocus Neck', 'fossils', 'Buried Ground', 4500, false),
        (370, 'Diplodocus Chest', 'fossils', 'Buried Ground', 4000, false),
        (371, 'Diplodocus Pelvis', 'fossils', 'Buried Ground', 4500, false),
        (372, 'Diplodocus Tail', 'fossils', 'Buried Ground', 4500, false),
        (373, 'Diplodocus Tail Tip', 'fossils', 'Buried Ground', 4000, false);
      `);
    }
  }

  async loadItems() {
    const res = await this.db.query<CatchableItem>('SELECT * FROM catch_tracker ORDER BY id ASC;');
    this.items.set(res.rows);
  }

  setTab(category: Category) {
    this.activeTab.set(category);
    localStorage.setItem(this.TAB_STORAGE_KEY, category);
  }

  updateSearch(query: string) {
    this.searchQuery.set(query);
  }

  async toggleCaught(item: CatchableItem) {
    await Haptics.impact({ style: ImpactStyle.Light }).catch(() => { });
    const updatedStatus = !item.caught;

    await this.db.query(
      'UPDATE catch_tracker SET caught = $1 WHERE id = $2;',
      [updatedStatus, item.id]
    );

    this.items.update((currentItems) =>
      currentItems.map((i) => (i.id === item.id ? { ...i, caught: updatedStatus } : i))
    );
  }
}