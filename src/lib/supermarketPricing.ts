export type SupermarketId = "tesco" | "sainsburys" | "asda" | "ocado" | "waitrose" | "morrisons" | "booths" | "aldi" | "lidl";

export interface PriceResult {
  ingredient: string;
  productName: string;
  price: number;
}

export interface SupermarketPrices {
  supermarketId: SupermarketId;
  items: PriceResult[];
  total: number;
}

/**
 * Keyword-based price lookup table for common UK grocery ingredients.
 * Prices are rough 2025 averages in GBP, with slight per-supermarket variance.
 * Order matters — first match wins, so put specific terms before generic ones.
 */
const PRICE_RULES: { keywords: string[]; base: number; label: string }[] = [
  // ── Proteins ──
  { keywords: ["chicken breast"], base: 3.80, label: "Chicken breast fillets" },
  { keywords: ["chicken thigh"], base: 2.90, label: "Chicken thighs" },
  { keywords: ["chicken wing"], base: 2.50, label: "Chicken wings" },
  { keywords: ["chicken drum"], base: 2.20, label: "Chicken drumsticks" },
  { keywords: ["whole chicken", "roasting chicken"], base: 4.50, label: "Whole chicken" },
  { keywords: ["chicken"], base: 3.50, label: "Chicken pieces" },
  { keywords: ["minced beef", "beef mince"], base: 3.50, label: "Beef mince 500g" },
  { keywords: ["stewing beef", "beef stew", "braising"], base: 4.50, label: "Stewing beef" },
  { keywords: ["sirloin", "steak"], base: 6.00, label: "Sirloin steak" },
  { keywords: ["beef"], base: 4.00, label: "Beef" },
  { keywords: ["lamb chop"], base: 5.50, label: "Lamb chops" },
  { keywords: ["lamb mince"], base: 4.00, label: "Lamb mince 500g" },
  { keywords: ["lamb shoulder", "lamb leg", "lamb shank"], base: 7.00, label: "Lamb joint" },
  { keywords: ["lamb"], base: 5.00, label: "Lamb" },
  { keywords: ["pork chop"], base: 3.20, label: "Pork chops" },
  { keywords: ["pork belly"], base: 4.00, label: "Pork belly" },
  { keywords: ["pork mince"], base: 2.80, label: "Pork mince 500g" },
  { keywords: ["pork loin", "pork fillet", "pork tenderloin"], base: 4.50, label: "Pork loin" },
  { keywords: ["chorizo"], base: 2.20, label: "Chorizo" },
  { keywords: ["pancetta"], base: 2.00, label: "Pancetta" },
  { keywords: ["prosciutto"], base: 2.50, label: "Prosciutto" },
  { keywords: ["sausage"], base: 2.50, label: "Sausages" },
  { keywords: ["bacon"], base: 2.80, label: "Bacon rashers" },
  { keywords: ["ham"], base: 2.50, label: "Ham" },
  { keywords: ["duck"], base: 6.00, label: "Duck" },
  { keywords: ["turkey"], base: 4.00, label: "Turkey" },
  { keywords: ["pork"], base: 3.50, label: "Pork" },

  // ── Seafood ──
  { keywords: ["salmon fillet", "salmon"], base: 4.50, label: "Salmon fillets" },
  { keywords: ["sea bass"], base: 5.00, label: "Sea bass" },
  { keywords: ["cod"], base: 4.00, label: "Cod fillets" },
  { keywords: ["haddock"], base: 4.00, label: "Haddock fillets" },
  { keywords: ["mackerel"], base: 2.50, label: "Mackerel" },
  { keywords: ["trout"], base: 4.50, label: "Trout" },
  { keywords: ["sardine"], base: 1.50, label: "Sardines" },
  { keywords: ["prawn", "shrimp", "king prawn"], base: 3.80, label: "Prawns" },
  { keywords: ["mussel"], base: 3.00, label: "Mussels" },
  { keywords: ["squid", "calamari"], base: 3.50, label: "Squid" },
  { keywords: ["scallop"], base: 6.00, label: "Scallops" },
  { keywords: ["crab"], base: 4.00, label: "Crab" },
  { keywords: ["anchov"], base: 1.80, label: "Anchovies" },
  { keywords: ["tuna"], base: 1.20, label: "Tuna tin" },
  { keywords: ["fish"], base: 3.50, label: "Fish" },
  { keywords: ["tofu"], base: 2.00, label: "Tofu" },
  { keywords: ["paneer"], base: 2.50, label: "Paneer" },
  { keywords: ["halloumi"], base: 2.80, label: "Halloumi" },

  // ── Dairy & eggs ──
  { keywords: ["egg"], base: 2.30, label: "Free-range eggs (box)" },
  { keywords: ["cheddar"], base: 2.80, label: "Cheddar cheese" },
  { keywords: ["parmesan"], base: 2.50, label: "Parmesan" },
  { keywords: ["mozzarella"], base: 1.20, label: "Mozzarella" },
  { keywords: ["feta"], base: 2.00, label: "Feta cheese" },
  { keywords: ["ricotta"], base: 1.80, label: "Ricotta" },
  { keywords: ["goat cheese", "goat's cheese", "goats cheese"], base: 2.20, label: "Goat's cheese" },
  { keywords: ["cream cheese"], base: 1.50, label: "Cream cheese" },
  { keywords: ["mascarpone"], base: 1.80, label: "Mascarpone" },
  { keywords: ["gruyere", "gruyère"], base: 3.00, label: "Gruyère" },
  { keywords: ["cheese"], base: 2.50, label: "Cheese" },
  { keywords: ["double cream"], base: 1.60, label: "Double cream" },
  { keywords: ["crème fraîche", "creme fraiche"], base: 1.40, label: "Crème fraîche" },
  { keywords: ["soured cream", "sour cream"], base: 1.10, label: "Soured cream" },
  { keywords: ["single cream", "cream"], base: 1.30, label: "Single cream" },
  { keywords: ["coconut cream"], base: 1.50, label: "Coconut cream" },
  { keywords: ["yoghurt", "yogurt"], base: 1.20, label: "Yoghurt" },
  { keywords: ["butter"], base: 2.00, label: "Butter 250g" },
  { keywords: ["milk"], base: 1.35, label: "Milk 2 pints" },

  // ── Carbs & grains ──
  { keywords: ["spaghetti"], base: 1.00, label: "Spaghetti 500g" },
  { keywords: ["penne"], base: 1.00, label: "Penne 500g" },
  { keywords: ["fusilli"], base: 1.00, label: "Fusilli 500g" },
  { keywords: ["linguine"], base: 1.00, label: "Linguine 500g" },
  { keywords: ["tagliatelle"], base: 1.20, label: "Tagliatelle 500g" },
  { keywords: ["rigatoni"], base: 1.00, label: "Rigatoni 500g" },
  { keywords: ["orzo"], base: 1.30, label: "Orzo 500g" },
  { keywords: ["lasagne sheet"], base: 1.20, label: "Lasagne sheets" },
  { keywords: ["pasta"], base: 1.00, label: "Pasta 500g" },
  { keywords: ["rice noodle"], base: 1.30, label: "Rice noodles" },
  { keywords: ["noodle"], base: 1.00, label: "Noodles" },
  { keywords: ["basmati", "rice"], base: 1.50, label: "Rice 1kg" },
  { keywords: ["couscous"], base: 1.20, label: "Couscous" },
  { keywords: ["bulgur", "bulghur"], base: 1.30, label: "Bulgur wheat" },
  { keywords: ["quinoa"], base: 2.00, label: "Quinoa" },
  { keywords: ["pearl barley", "barley"], base: 1.20, label: "Pearl barley" },
  { keywords: ["polenta"], base: 1.50, label: "Polenta" },
  { keywords: ["puff pastry"], base: 1.80, label: "Puff pastry" },
  { keywords: ["filo pastry", "filo", "phyllo"], base: 1.80, label: "Filo pastry" },
  { keywords: ["shortcrust"], base: 1.50, label: "Shortcrust pastry" },
  { keywords: ["tortilla", "wrap"], base: 1.20, label: "Tortilla wraps" },
  { keywords: ["naan"], base: 1.20, label: "Naan breads" },
  { keywords: ["pitta"], base: 0.80, label: "Pitta bread" },
  { keywords: ["ciabatta"], base: 1.20, label: "Ciabatta" },
  { keywords: ["focaccia"], base: 1.50, label: "Focaccia" },
  { keywords: ["baguette"], base: 1.00, label: "Baguette" },
  { keywords: ["sourdough"], base: 2.00, label: "Sourdough loaf" },
  { keywords: ["bread"], base: 1.20, label: "Bread loaf" },
  { keywords: ["breadcrumb", "panko"], base: 1.20, label: "Breadcrumbs" },
  { keywords: ["flour"], base: 1.10, label: "Plain flour 1kg" },
  { keywords: ["cornflour", "corn flour", "cornstarch"], base: 0.90, label: "Cornflour" },
  { keywords: ["potato", "potatoes"], base: 1.50, label: "Potatoes 2kg" },
  { keywords: ["sweet potato"], base: 1.20, label: "Sweet potatoes" },

  // ── Vegetables ──
  { keywords: ["spring onion", "salad onion"], base: 0.65, label: "Spring onions" },
  { keywords: ["red onion"], base: 0.80, label: "Red onion" },
  { keywords: ["shallot", "banana shallot"], base: 0.60, label: "Shallots" },
  { keywords: ["onion"], base: 0.80, label: "Onions" },
  { keywords: ["garlic"], base: 0.50, label: "Garlic bulb" },
  { keywords: ["ginger"], base: 0.70, label: "Fresh ginger" },
  { keywords: ["lemongrass"], base: 0.80, label: "Lemongrass" },
  { keywords: ["chopped tomatoes", "tinned tomatoes", "canned tomatoes"], base: 0.65, label: "Chopped tomatoes tin" },
  { keywords: ["cherry tomato", "cherry tom"], base: 1.10, label: "Cherry tomatoes" },
  { keywords: ["sun-dried tomato", "sundried tomato", "sun dried"], base: 2.00, label: "Sun-dried tomatoes" },
  { keywords: ["tomato paste", "tomato purée", "tomato puree"], base: 0.75, label: "Tomato purée" },
  { keywords: ["passata"], base: 0.90, label: "Passata" },
  { keywords: ["tomato", "tomatoes"], base: 0.90, label: "Tomatoes" },
  { keywords: ["red pepper", "red bell pepper"], base: 0.70, label: "Red pepper" },
  { keywords: ["green pepper", "green bell pepper"], base: 0.65, label: "Green pepper" },
  { keywords: ["yellow pepper"], base: 0.70, label: "Yellow pepper" },
  { keywords: ["orange pepper"], base: 0.70, label: "Orange pepper" },
  { keywords: ["pepper", "bell pepper"], base: 0.70, label: "Peppers" },
  { keywords: ["chilli", "chili", "green chilli", "red chilli"], base: 0.50, label: "Chillies" },
  { keywords: ["jalapeño", "jalapeno"], base: 0.60, label: "Jalapeños" },
  { keywords: ["scotch bonnet"], base: 0.60, label: "Scotch bonnet chillies" },
  { keywords: ["carrot"], base: 0.60, label: "Carrots" },
  { keywords: ["celery"], base: 0.80, label: "Celery" },
  { keywords: ["celeriac"], base: 1.50, label: "Celeriac" },
  { keywords: ["broccoli"], base: 0.85, label: "Broccoli" },
  { keywords: ["cauliflower"], base: 1.00, label: "Cauliflower" },
  { keywords: ["spinach"], base: 1.00, label: "Spinach" },
  { keywords: ["kale"], base: 1.00, label: "Kale" },
  { keywords: ["cabbage", "red cabbage"], base: 0.80, label: "Cabbage" },
  { keywords: ["pak choi", "bok choy"], base: 1.00, label: "Pak choi" },
  { keywords: ["courgette", "zucchini"], base: 0.65, label: "Courgette" },
  { keywords: ["aubergine", "eggplant"], base: 0.85, label: "Aubergine" },
  { keywords: ["butternut squash"], base: 1.20, label: "Butternut squash" },
  { keywords: ["squash"], base: 1.20, label: "Squash" },
  { keywords: ["pumpkin"], base: 1.50, label: "Pumpkin" },
  { keywords: ["mushroom"], base: 0.90, label: "Mushrooms" },
  { keywords: ["leek"], base: 0.80, label: "Leeks" },
  { keywords: ["fennel"], base: 1.20, label: "Fennel" },
  { keywords: ["asparagus"], base: 2.00, label: "Asparagus" },
  { keywords: ["green bean", "french bean", "runner bean"], base: 1.20, label: "Green beans" },
  { keywords: ["mange tout", "mangetout", "sugar snap"], base: 1.50, label: "Mange tout" },
  { keywords: ["edamame"], base: 1.80, label: "Edamame beans" },
  { keywords: ["sweetcorn", "corn on the cob", "corn"], base: 0.80, label: "Sweetcorn" },
  { keywords: ["peas", "frozen peas", "petit pois"], base: 1.00, label: "Peas" },
  { keywords: ["avocado"], base: 1.00, label: "Avocado" },
  { keywords: ["lettuce"], base: 0.70, label: "Lettuce" },
  { keywords: ["rocket"], base: 1.00, label: "Rocket" },
  { keywords: ["watercress"], base: 1.00, label: "Watercress" },
  { keywords: ["cucumber"], base: 0.55, label: "Cucumber" },
  { keywords: ["radish"], base: 0.70, label: "Radishes" },
  { keywords: ["beetroot"], base: 1.00, label: "Beetroot" },
  { keywords: ["turnip", "swede"], base: 0.80, label: "Swede" },
  { keywords: ["parsnip"], base: 0.90, label: "Parsnips" },
  { keywords: ["artichoke"], base: 2.00, label: "Artichoke" },
  { keywords: ["olive"], base: 1.80, label: "Olives" },
  { keywords: ["caper"], base: 1.50, label: "Capers" },
  { keywords: ["gherkin", "cornichon"], base: 1.50, label: "Gherkins" },
  { keywords: ["samphire"], base: 2.50, label: "Samphire" },

  // ── Fruit ──
  { keywords: ["lemon"], base: 0.35, label: "Lemon" },
  { keywords: ["lime"], base: 0.30, label: "Lime" },
  { keywords: ["orange"], base: 0.40, label: "Orange" },
  { keywords: ["grapefruit"], base: 0.60, label: "Grapefruit" },
  { keywords: ["banana"], base: 0.75, label: "Bananas bunch" },
  { keywords: ["apple"], base: 0.30, label: "Apples" },
  { keywords: ["pear"], base: 0.40, label: "Pear" },
  { keywords: ["mango"], base: 1.00, label: "Mango" },
  { keywords: ["pomegranate"], base: 1.20, label: "Pomegranate" },
  { keywords: ["passion fruit", "passionfruit"], base: 0.60, label: "Passion fruit" },
  { keywords: ["raspberry", "raspberries"], base: 2.50, label: "Raspberries" },
  { keywords: ["blueberry", "blueberries"], base: 2.50, label: "Blueberries" },
  { keywords: ["strawberry", "strawberries"], base: 2.00, label: "Strawberries" },
  { keywords: ["blackberry", "blackberries"], base: 2.50, label: "Blackberries" },
  { keywords: ["cranberry", "cranberries"], base: 2.00, label: "Cranberries" },
  { keywords: ["raisin", "sultana", "currant"], base: 1.50, label: "Dried fruit" },
  { keywords: ["date"], base: 2.00, label: "Dates" },
  { keywords: ["fig"], base: 2.00, label: "Figs" },
  { keywords: ["coconut"], base: 1.00, label: "Coconut" },

  // ── Herbs, spices & seasonings ──
  { keywords: ["garam masala"], base: 1.50, label: "Garam masala" },
  { keywords: ["curry powder"], base: 1.30, label: "Curry powder" },
  { keywords: ["curry paste"], base: 1.80, label: "Curry paste" },
  { keywords: ["chilli powder", "chili powder"], base: 1.20, label: "Chilli powder" },
  { keywords: ["chilli flakes", "chili flakes", "red pepper flakes"], base: 1.10, label: "Chilli flakes" },
  { keywords: ["cayenne"], base: 1.20, label: "Cayenne pepper" },
  { keywords: ["cumin seed"], base: 1.30, label: "Cumin seeds" },
  { keywords: ["cumin"], base: 1.20, label: "Ground cumin" },
  { keywords: ["coriander seed"], base: 1.20, label: "Coriander seeds" },
  { keywords: ["fresh coriander", "coriander leaves", "bunch coriander"], base: 0.70, label: "Fresh coriander" },
  { keywords: ["coriander"], base: 0.70, label: "Coriander" },
  { keywords: ["smoked paprika"], base: 1.30, label: "Smoked paprika" },
  { keywords: ["paprika"], base: 1.20, label: "Paprika" },
  { keywords: ["turmeric"], base: 1.20, label: "Turmeric" },
  { keywords: ["cinnamon stick"], base: 1.30, label: "Cinnamon sticks" },
  { keywords: ["cinnamon"], base: 1.20, label: "Ground cinnamon" },
  { keywords: ["nutmeg"], base: 1.50, label: "Nutmeg" },
  { keywords: ["cardamom", "cardamon"], base: 1.80, label: "Cardamom" },
  { keywords: ["clove"], base: 1.20, label: "Cloves" },
  { keywords: ["star anise"], base: 1.50, label: "Star anise" },
  { keywords: ["fennel seed"], base: 1.20, label: "Fennel seeds" },
  { keywords: ["fenugreek"], base: 1.30, label: "Fenugreek seeds" },
  { keywords: ["mustard seed"], base: 1.20, label: "Mustard seeds" },
  { keywords: ["five spice", "five-spice"], base: 1.50, label: "Chinese five spice" },
  { keywords: ["mixed herb", "italian herb", "herbes de provence"], base: 1.00, label: "Mixed herbs" },
  { keywords: ["oregano"], base: 1.00, label: "Oregano" },
  { keywords: ["thyme"], base: 0.80, label: "Fresh thyme" },
  { keywords: ["rosemary"], base: 0.80, label: "Fresh rosemary" },
  { keywords: ["sage"], base: 0.80, label: "Fresh sage" },
  { keywords: ["basil"], base: 0.80, label: "Fresh basil" },
  { keywords: ["parsley"], base: 0.70, label: "Fresh parsley" },
  { keywords: ["mint"], base: 0.70, label: "Fresh mint" },
  { keywords: ["dill"], base: 0.80, label: "Fresh dill" },
  { keywords: ["chive"], base: 0.80, label: "Fresh chives" },
  { keywords: ["tarragon"], base: 1.00, label: "Fresh tarragon" },
  { keywords: ["bay lea"], base: 0.90, label: "Bay leaves" },
  { keywords: ["saffron"], base: 3.50, label: "Saffron" },
  { keywords: ["sumac"], base: 2.00, label: "Sumac" },
  { keywords: ["za'atar", "zaatar"], base: 2.00, label: "Za'atar" },
  { keywords: ["ras el hanout"], base: 2.00, label: "Ras el hanout" },
  { keywords: ["garlic salt", "garlic powder", "garlic granule"], base: 1.00, label: "Garlic seasoning" },
  { keywords: ["onion powder", "onion granule"], base: 1.00, label: "Onion powder" },
  { keywords: ["sea salt", "salt flake"], base: 1.20, label: "Sea salt" },
  { keywords: ["salt"], base: 0.70, label: "Salt" },
  { keywords: ["black pepper", "peppercorn"], base: 1.00, label: "Black pepper" },

  // ── Oils, sauces & condiments ──
  { keywords: ["extra virgin olive oil", "extra-virgin"], base: 4.00, label: "Extra virgin olive oil" },
  { keywords: ["olive oil"], base: 3.50, label: "Olive oil" },
  { keywords: ["sesame oil"], base: 2.00, label: "Sesame oil" },
  { keywords: ["coconut oil"], base: 3.00, label: "Coconut oil" },
  { keywords: ["vegetable oil", "sunflower oil", "rapeseed oil", "oil"], base: 2.00, label: "Cooking oil" },
  { keywords: ["soy sauce"], base: 1.50, label: "Soy sauce" },
  { keywords: ["fish sauce"], base: 1.80, label: "Fish sauce" },
  { keywords: ["oyster sauce"], base: 1.80, label: "Oyster sauce" },
  { keywords: ["sriracha", "hot sauce", "tabasco"], base: 2.00, label: "Hot sauce" },
  { keywords: ["harissa"], base: 2.20, label: "Harissa paste" },
  { keywords: ["tahini"], base: 2.50, label: "Tahini" },
  { keywords: ["pesto"], base: 2.00, label: "Pesto" },
  { keywords: ["worcestershire"], base: 1.50, label: "Worcestershire sauce" },
  { keywords: ["balsamic"], base: 2.50, label: "Balsamic vinegar" },
  { keywords: ["red wine vinegar"], base: 1.50, label: "Red wine vinegar" },
  { keywords: ["white wine vinegar"], base: 1.50, label: "White wine vinegar" },
  { keywords: ["rice vinegar"], base: 1.50, label: "Rice vinegar" },
  { keywords: ["vinegar"], base: 1.20, label: "Vinegar" },
  { keywords: ["honey"], base: 2.50, label: "Honey" },
  { keywords: ["maple syrup"], base: 3.50, label: "Maple syrup" },
  { keywords: ["golden syrup", "treacle"], base: 1.50, label: "Golden syrup" },
  { keywords: ["wholegrain mustard"], base: 1.50, label: "Wholegrain mustard" },
  { keywords: ["dijon mustard", "dijon"], base: 1.50, label: "Dijon mustard" },
  { keywords: ["english mustard"], base: 1.30, label: "English mustard" },
  { keywords: ["mustard"], base: 1.30, label: "Mustard" },
  { keywords: ["ketchup"], base: 1.50, label: "Ketchup" },
  { keywords: ["mayonnaise", "mayo"], base: 1.80, label: "Mayonnaise" },
  { keywords: ["mango chutney", "chutney"], base: 1.80, label: "Chutney" },
  { keywords: ["pickle", "piccalilli"], base: 1.50, label: "Pickle" },
  { keywords: ["miso"], base: 2.50, label: "Miso paste" },
  { keywords: ["hoisin"], base: 1.80, label: "Hoisin sauce" },
  { keywords: ["teriyaki"], base: 2.00, label: "Teriyaki sauce" },
  { keywords: ["sweet chilli sauce"], base: 1.50, label: "Sweet chilli sauce" },
  { keywords: ["stock cube", "stock pot", "stock"], base: 1.20, label: "Stock cubes" },
  { keywords: ["red wine"], base: 5.00, label: "Red wine" },
  { keywords: ["white wine"], base: 5.00, label: "White wine" },
  { keywords: ["sherry"], base: 4.50, label: "Sherry" },
  { keywords: ["marsala"], base: 5.00, label: "Marsala wine" },

  // ── Nuts & seeds ──
  { keywords: ["pine nut"], base: 2.50, label: "Pine nuts" },
  { keywords: ["almond"], base: 2.00, label: "Almonds" },
  { keywords: ["walnut"], base: 2.50, label: "Walnuts" },
  { keywords: ["cashew"], base: 2.50, label: "Cashew nuts" },
  { keywords: ["pistachio"], base: 3.50, label: "Pistachios" },
  { keywords: ["hazelnut"], base: 2.50, label: "Hazelnuts" },
  { keywords: ["pecan"], base: 3.00, label: "Pecans" },
  { keywords: ["peanut"], base: 1.50, label: "Peanuts" },
  { keywords: ["sesame seed"], base: 1.20, label: "Sesame seeds" },
  { keywords: ["pumpkin seed"], base: 1.80, label: "Pumpkin seeds" },
  { keywords: ["sunflower seed"], base: 1.20, label: "Sunflower seeds" },
  { keywords: ["flaked almond"], base: 2.00, label: "Flaked almonds" },
  { keywords: ["ground almond"], base: 2.50, label: "Ground almonds" },
  { keywords: ["desiccated coconut"], base: 1.20, label: "Desiccated coconut" },

  // ── Baking & pantry ──
  { keywords: ["caster sugar"], base: 1.20, label: "Caster sugar" },
  { keywords: ["icing sugar"], base: 1.20, label: "Icing sugar" },
  { keywords: ["brown sugar", "demerara", "muscovado"], base: 1.30, label: "Brown sugar" },
  { keywords: ["sugar"], base: 1.00, label: "Sugar 1kg" },
  { keywords: ["baking powder"], base: 1.00, label: "Baking powder" },
  { keywords: ["bicarbonate", "baking soda"], base: 0.90, label: "Bicarbonate of soda" },
  { keywords: ["yeast"], base: 1.00, label: "Yeast" },
  { keywords: ["gelatine", "gelatin"], base: 1.50, label: "Gelatine" },
  { keywords: ["cocoa"], base: 2.00, label: "Cocoa powder" },
  { keywords: ["dark chocolate", "milk chocolate", "white chocolate", "chocolate chip"], base: 2.00, label: "Chocolate" },
  { keywords: ["chocolate"], base: 2.00, label: "Chocolate bar" },
  { keywords: ["vanilla extract", "vanilla essence", "vanilla"], base: 2.80, label: "Vanilla extract" },
  { keywords: ["almond extract"], base: 2.50, label: "Almond extract" },
  { keywords: ["rose water", "rosewater"], base: 2.00, label: "Rose water" },
  { keywords: ["coconut milk"], base: 1.20, label: "Coconut milk tin" },
  { keywords: ["condensed milk"], base: 1.50, label: "Condensed milk" },
  { keywords: ["evaporated milk"], base: 1.20, label: "Evaporated milk" },
  { keywords: ["chickpea"], base: 0.70, label: "Chickpeas tin" },
  { keywords: ["cannellini"], base: 0.70, label: "Cannellini beans tin" },
  { keywords: ["butter bean"], base: 0.80, label: "Butter beans tin" },
  { keywords: ["borlotti"], base: 0.80, label: "Borlotti beans tin" },
  { keywords: ["kidney bean"], base: 0.70, label: "Kidney beans tin" },
  { keywords: ["black bean"], base: 0.70, label: "Black beans tin" },
  { keywords: ["baked bean"], base: 0.80, label: "Baked beans" },
  { keywords: ["lentil"], base: 0.80, label: "Lentils" },
  { keywords: ["bean"], base: 0.70, label: "Beans tin" },
  { keywords: ["peanut butter"], base: 2.00, label: "Peanut butter" },
  { keywords: ["jam"], base: 1.50, label: "Jam" },
  { keywords: ["marmalade"], base: 1.80, label: "Marmalade" },
];

/** Per-supermarket multiplier to simulate slight price variation */
const SUPERMARKET_MULTIPLIER: Record<SupermarketId, number> = {
  aldi: 0.78,
  lidl: 0.79,
  asda: 0.95,
  morrisons: 0.97,
  booths: 1.10,
  tesco: 1.00,
  sainsburys: 1.04,
  ocado: 1.08,
  waitrose: 1.12,
};

function estimateIngredientPrice(
  ingredient: string,
  supermarket: SupermarketId
): PriceResult {
  const lower = ingredient.toLowerCase();
  for (const rule of PRICE_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      const price = +(rule.base * SUPERMARKET_MULTIPLIER[supermarket]).toFixed(2);
      return { ingredient, productName: rule.label, price };
    }
  }
  // Fallback: assign a modest average price
  return { ingredient, productName: ingredient, price: +(1.50 * SUPERMARKET_MULTIPLIER[supermarket]).toFixed(2) };
}

/**
 * Generate estimated prices for all ingredients across four supermarkets.
 * Runs entirely client-side — no API calls.
 */
export function estimateAllPrices(
  ingredients: string[]
): Record<SupermarketId, SupermarketPrices> {
  const supermarkets: SupermarketId[] = ["tesco", "sainsburys", "asda", "ocado", "waitrose", "morrisons", "booths", "aldi", "lidl"];
  const results = {} as Record<SupermarketId, SupermarketPrices>;

  for (const sid of supermarkets) {
    const items = ingredients.map((ing) => estimateIngredientPrice(ing, sid));
    const total = items.reduce((sum, item) => sum + item.price, 0);
    results[sid] = { supermarketId: sid, items, total: +total.toFixed(2) };
  }

  return results;
}
