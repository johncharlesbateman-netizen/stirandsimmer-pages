// Per-recipe FAQ entries. Targets long-tail question keywords with low
// competition so individual recipe pages can rank for "people also ask"
// style queries. Rendered visibly on the page and emitted as FAQPage
// JSON-LD for rich-results eligibility.

export interface RecipeFAQ {
  question: string;
  answer: string;
}

export const recipeFAQs: Record<string, RecipeFAQ[]> = {
  "cacio-e-pepe": [
    {
      question: "Can I use Parmesan for cacio e pepe?",
      answer:
        "Traditional cacio e pepe uses Pecorino Romano, which is sharper, saltier and more pungent than Parmesan. You can substitute Parmigiano Reggiano in a pinch, but the flavour will be milder and less distinctly Roman — for the closest result, use a 50/50 blend of Pecorino and Parmesan.",
    },
    {
      question: "How do you pronounce cacio e pepe?",
      answer:
        "It's pronounced KAH-choh eh PEH-peh. The Italian phrase literally means \"cheese and pepper\", which is exactly what the dish is built around.",
    },
    {
      question: "Is cacio e pepe vegetarian?",
      answer:
        "Yes — cacio e pepe contains only pasta, Pecorino Romano, black pepper and pasta water, so it is vegetarian. Note that traditional Pecorino Romano is made with animal rennet, so it is not strictly vegetarian by all definitions; look for a Pecorino labelled with vegetable rennet if that matters to you.",
    },
    {
      question: "Can you reheat cacio e pepe?",
      answer:
        "Cacio e pepe is best eaten immediately, as the cheese sauce can clump or split when reheated. If you must reheat it, do so gently in a pan with a splash of fresh pasta water or milk, stirring constantly over low heat until the sauce comes back together.",
    },
    {
      question: "Can you make cacio e pepe with penne or other pasta?",
      answer:
        "Traditionally cacio e pepe is made with tonnarelli or spaghetti, which hold the cheese sauce well. Penne, rigatoni or bucatini all work too — any pasta with a good surface area or ridges will help the sauce cling, though long pasta gives the most authentic result.",
    },
    {
      question: "Is cacio e pepe Roman?",
      answer:
        "Yes — cacio e pepe is one of the four classic Roman pasta dishes, alongside carbonara, amatriciana and gricia. It originated with Roman shepherds who carried dried pasta, aged Pecorino and peppercorns into the hills, ingredients that needed no refrigeration.",
    },
  ],
  "spaghetti-bolognese": [
    {
      question: "Is spaghetti bolognese actually Italian?",
      answer:
        "Spaghetti bolognese as we know it is not traditionally Italian. In Bologna the classic ragù alla bolognese is served with fresh tagliatelle, never spaghetti, because the wide flat ribbons hold the meaty sauce far better. The spaghetti pairing is largely a British and American adaptation that became globally popular in the 20th century.",
    },
    {
      question: "What is the difference between bolognese and ragù?",
      answer:
        "Ragù is the Italian umbrella term for any slow-cooked meat sauce, while ragù alla bolognese is the specific version from Bologna made with beef (often with pork or pancetta), soffritto, tomato, wine and a little milk. All bolognese is ragù, but not all ragù is bolognese.",
    },
    {
      question: "Can I make spaghetti bolognese without wine?",
      answer:
        "Yes — replace the wine with an equal amount of beef stock plus a teaspoon of red wine vinegar or balsamic vinegar to mimic the acidity. The sauce will be slightly less complex but still rich and well-balanced.",
    },
    {
      question: "Why do you add milk to bolognese?",
      answer:
        "A splash of milk is traditional in authentic bolognese — it tenderises the meat, mellows the acidity of the tomatoes and gives the finished sauce a softer, more rounded flavour. Add it before the wine and let it simmer until almost evaporated.",
    },
    {
      question: "How long should you simmer bolognese?",
      answer:
        "For the best flavour, simmer bolognese gently for at least 1.5 to 2 hours, ideally 3. Long, slow cooking breaks down the meat fibres, concentrates the sauce and lets the flavours meld. A 30-minute version works on a weeknight, but the depth is noticeably different.",
    },
    {
      question: "Can you freeze spaghetti bolognese sauce?",
      answer:
        "Yes — bolognese freezes brilliantly for up to 3 months. Cool it completely, portion into airtight containers or freezer bags, and defrost overnight in the fridge before reheating gently on the hob with a splash of water or stock to loosen.",
    },
  ],
  "butter-chicken": [
    {
      question: "What is the difference between butter chicken and tikka masala?",
      answer:
        "Butter chicken (murgh makhani) is a Delhi dish with a sweeter, smoother, tomato-and-cream sauce enriched with butter and dried fenugreek. Chicken tikka masala is generally spicier, slightly tangier and less sweet, and is widely thought to have been created in Britain rather than India.",
    },
    {
      question: "Is butter chicken spicy?",
      answer:
        "Authentic butter chicken is mildly spiced rather than hot — the focus is on warm, aromatic spices like garam masala, fenugreek and Kashmiri chilli, balanced by cream and butter. It's one of the gentler Indian curries, which is why it's a popular introduction to the cuisine.",
    },
    {
      question: "Can I make butter chicken without cream?",
      answer:
        "Yes — substitute full-fat Greek yoghurt, coconut cream or cashew cream (soaked cashews blended with water) for a similar richness. Stir it in off the heat to prevent splitting, and add a small extra knob of butter to keep the sauce silky.",
    },
    {
      question: "What do you serve with butter chicken?",
      answer:
        "Butter chicken is classically served with basmati rice or fluffy naan to mop up the sauce. Cucumber raita, a simple kachumber salad and a sprinkle of fresh coriander all balance the richness beautifully.",
    },
    {
      question: "Can you make butter chicken ahead of time?",
      answer:
        "Yes — butter chicken actually improves overnight as the spices meld. Make the sauce up to 2 days ahead and refrigerate, then reheat gently and stir through a fresh splash of cream just before serving. It also freezes well for up to 2 months.",
    },
    {
      question: "What does kasuri methi do in butter chicken?",
      answer:
        "Kasuri methi (dried fenugreek leaves) gives butter chicken its signature savoury, slightly bitter, almost maple-like aroma. Crumble a teaspoon between your palms and stir it in at the end of cooking — it's a small ingredient that makes a huge difference to authenticity.",
    },
  ],
  "best-coq-au-vin": [
    {
      question: "How do you pronounce coq au vin?",
      answer:
        "It's pronounced \"kock-oh-van\" (roughly KOK-oh-VAN). The French phrase literally means \"rooster in wine\", referring to the dish's origins as a way to tenderise tough older birds with a long red-wine braise.",
    },
    {
      question: "What is the best wine for coq au vin?",
      answer:
        "Traditionally a Burgundy (Pinot Noir) is used, since the dish hails from the region. Any dry, medium-bodied red works well — a Côtes du Rhône, Beaujolais or even a Chianti will give a lovely depth. Avoid heavily oaked or sweet wines, and always cook with something you'd happily drink.",
    },
    {
      question: "Can I make coq au vin with chicken thighs?",
      answer:
        "Yes — bone-in, skin-on chicken thighs are actually ideal. They stay moist and flavourful through the long braise, unlike chicken breasts which can dry out. A whole jointed chicken or a mix of thighs and drumsticks gives the most authentic result.",
    },
    {
      question: "Can you make coq au vin without wine?",
      answer:
        "You can approximate it with rich beef or chicken stock plus a splash of red wine vinegar or grape juice for acidity, but the dish will lose its defining character. If avoiding alcohol, consider a different braise — the wine is central to coq au vin's identity.",
    },
    {
      question: "Is coq au vin better the next day?",
      answer:
        "Absolutely — like most red-wine braises, coq au vin improves overnight as the flavours deepen and the sauce thickens. Make it a day ahead, refrigerate, then reheat gently on the hob. It's the perfect dinner-party dish for that reason.",
    },
    {
      question: "What do you serve with coq au vin?",
      answer:
        "Classic French accompaniments are buttery mashed potatoes, crusty baguette or wide egg noodles to soak up the sauce. A simple green salad with Dijon vinaigrette balances the richness, and pour the same red wine you cooked with.",
    },
  ],
  "beef-stroganoff": [
    {
      question: "What is the best cut of beef for stroganoff?",
      answer:
        "Tender quick-cooking cuts work best: fillet (tenderloin), sirloin or rump steak, sliced thinly across the grain. These cook in minutes and stay tender in the sour-cream sauce. Avoid stewing cuts like chuck unless you're slow-braising, which is a different style of dish.",
    },
    {
      question: "Can I use Greek yoghurt instead of sour cream in stroganoff?",
      answer:
        "Yes — full-fat Greek yoghurt is a good substitute, but stir it in off the heat and don't let the sauce boil afterwards, or it can split. Crème fraîche is even more reliable as it's more stable when warmed.",
    },
    {
      question: "Is beef stroganoff Russian?",
      answer:
        "Yes — beef stroganoff originated in mid-19th-century Russia and is named after the influential Stroganov family. The original was a simple sauté of beef with mustard and sour cream; mushrooms, onions and the now-classic noodle pairing were added by later cooks across Europe and America.",
    },
    {
      question: "What do you serve with beef stroganoff?",
      answer:
        "Traditionally beef stroganoff is served over buttered egg noodles or with rice. In Russia, crisp matchstick potatoes (similar to shoestring fries) are the classic accompaniment. A sharp green salad or pickled cucumbers cut through the richness nicely.",
    },
    {
      question: "Can you make beef stroganoff ahead of time?",
      answer:
        "The mushroom and onion base can be made a day ahead and refrigerated, but for the best texture cook the beef and finish the sauce just before serving — beef quickly turns tough when reheated. If you do reheat the full dish, do so very gently over low heat.",
    },
    {
      question: "Why is my stroganoff sauce curdled?",
      answer:
        "Sour cream and crème fraîche split if boiled or added to a sauce that's too hot. Take the pan off the heat, let it cool for a minute, then stir the dairy in gradually. If it has already split, whisk in a tablespoon of cold cream or a slurry of cornflour and water to bring it back together.",
    },
  ],
};
