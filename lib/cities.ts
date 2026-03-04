export interface CityData {
  slug: string;
  name: string;
  county: string;
  description: string;
  nearbyAreas: string[];
}

export const DFW_CITIES: CityData[] = [
  {
    slug: "dallas",
    name: "Dallas",
    county: "Dallas County",
    description:
      "From Uptown to Oak Cliff, TheBubbleHeros brings foam cannons and bubble machines to birthday parties, school events, and community festivals across Dallas. Whether you are hosting in your backyard near White Rock Lake or at a venue in Deep Ellum, our trained operators deliver a safe, mess-free foam party experience your guests will talk about for years.",
    nearbyAreas: ["Irving", "Garland", "Richardson", "Mesquite"],
  },
  {
    slug: "fort-worth",
    name: "Fort Worth",
    county: "Tarrant County",
    description:
      "Fort Worth families love our bubble truck parties! We serve neighborhoods from the Cultural District to Alliance, bringing non-toxic, hypoallergenic foam fun to backyards, parks, and event venues. Our bubble and foam party packages are perfect for Fort Worth birthday celebrations, church gatherings, and school field days.",
    nearbyAreas: ["Arlington", "Keller", "Mansfield", "Haltom City"],
  },
  {
    slug: "frisco",
    name: "Frisco",
    county: "Collin County",
    description:
      "Frisco is one of our busiest markets and for good reason — families here love unique party experiences! Our foam cannons and bubble machines are a hit at Frisco birthday parties, neighborhood HOA events, and school celebrations. We travel to every corner of Frisco, from Panther Creek to Phillips Creek Ranch.",
    nearbyAreas: ["Prosper", "McKinney", "Plano", "Little Elm"],
  },
  {
    slug: "plano",
    name: "Plano",
    county: "Collin County",
    description:
      "Plano residents consistently book TheBubbleHeros for birthday bashes, summer block parties, and preschool events. Our mobile foam truck arrives at your Plano home or venue with everything needed — foam cannon, music, and a trained operator — for a worry-free, unforgettable celebration.",
    nearbyAreas: ["Richardson", "Allen", "Frisco", "Murphy"],
  },
  {
    slug: "mckinney",
    name: "McKinney",
    county: "Collin County",
    description:
      "McKinney's growing family community makes it a perfect fit for our bubble and foam party services. From historic downtown McKinney to the new developments in Stonebridge Ranch and Trinity Falls, we bring the fun directly to you with our fully-equipped foam truck.",
    nearbyAreas: ["Allen", "Frisco", "Prosper", "Princeton"],
  },
  {
    slug: "allen",
    name: "Allen",
    county: "Collin County",
    description:
      "Allen families trust TheBubbleHeros for birthday parties, end-of-year school bashes, and neighborhood events. Our bubble machines and foam cannons transform any Allen backyard or park into a bubbly wonderland. Safe, biodegradable foam means zero cleanup for you.",
    nearbyAreas: ["McKinney", "Plano", "Frisco", "Lucas"],
  },
  {
    slug: "arlington",
    name: "Arlington",
    county: "Tarrant County",
    description:
      "Located right between Dallas and Fort Worth, Arlington is a hub for family entertainment — and TheBubbleHeros fits right in. We bring foam parties and bubble experiences to Arlington backyards, churches, daycare centers, and community parks for events of all sizes.",
    nearbyAreas: ["Fort Worth", "Mansfield", "Grand Prairie", "Irving"],
  },
  {
    slug: "irving",
    name: "Irving",
    county: "Dallas County",
    description:
      "Irving families and corporate event planners love booking our bubble truck for everything from kids' birthday parties to company picnics at Las Colinas. Our hypoallergenic, non-toxic foam is safe for all ages and leaves no residue on lawns or venues.",
    nearbyAreas: ["Dallas", "Grand Prairie", "Arlington", "Coppell"],
  },
  {
    slug: "garland",
    name: "Garland",
    county: "Dallas County",
    description:
      "From the shores of Lake Ray Hubbard to neighborhoods throughout the city, Garland families choose TheBubbleHeros for foam-filled birthday parties and community events. Our mobile setup means we come to you — no venue rental needed.",
    nearbyAreas: ["Dallas", "Richardson", "Rowlett", "Mesquite"],
  },
  {
    slug: "richardson",
    name: "Richardson",
    county: "Dallas County",
    description:
      "Richardson parents and school administrators book our bubble and foam parties for birthday celebrations, PTA events, and summer camp activities. We bring professional-grade foam cannons and bubble machines to any Richardson location for safe, high-energy outdoor fun.",
    nearbyAreas: ["Dallas", "Plano", "Garland", "Allen"],
  },
  {
    slug: "denton",
    name: "Denton",
    county: "Denton County",
    description:
      "Denton's vibrant community loves a good party, and our foam truck delivers exactly that. Whether you are celebrating near the Square or hosting in a Denton neighborhood, TheBubbleHeros brings non-stop bubble fun with music and professional operators.",
    nearbyAreas: ["Lewisville", "Flower Mound", "Corinth", "Aubrey"],
  },
  {
    slug: "lewisville",
    name: "Lewisville",
    county: "Denton County",
    description:
      "Lewisville and Castle Hills families have made foam parties one of the most requested birthday activities in the area. Our bubble machines and foam cannons deliver hours of entertainment for kids and adults alike, with zero mess left behind.",
    nearbyAreas: ["Flower Mound", "Denton", "Coppell", "Highland Village"],
  },
  {
    slug: "flower-mound",
    name: "Flower Mound",
    county: "Denton County",
    description:
      "Flower Mound's family-friendly neighborhoods are perfect for our outdoor foam party experiences. We set up our bubble truck in your driveway or backyard and create a bubbly wonderland that kids and parents love. Safe foam, great music, and a trained operator included.",
    nearbyAreas: ["Lewisville", "Highland Village", "Grapevine", "Coppell"],
  },
  {
    slug: "southlake",
    name: "Southlake",
    county: "Tarrant County",
    description:
      "Southlake families expect premium experiences, and TheBubbleHeros delivers. Our foam party packages include professional-grade equipment, trained operators, and 100% organic, hypoallergenic foam. Perfect for Southlake birthday celebrations, school events, and private neighborhood gatherings.",
    nearbyAreas: ["Grapevine", "Keller", "Colleyville", "Westlake"],
  },
  {
    slug: "grapevine",
    name: "Grapevine",
    county: "Tarrant County",
    description:
      "Whether it is a birthday party near Main Street or a backyard bash by Grapevine Lake, our bubble truck brings the ultimate party experience. Grapevine families love our foam cannons for summer celebrations, holiday events, and school fundraisers.",
    nearbyAreas: ["Southlake", "Colleyville", "Flower Mound", "Coppell"],
  },
  {
    slug: "keller",
    name: "Keller",
    county: "Tarrant County",
    description:
      "Keller is home to some of our most loyal customers. Families here love our bubble and foam party packages for birthday bashes, VBS events, and neighborhood block parties. We handle all setup and cleanup so you can focus on having fun.",
    nearbyAreas: ["Southlake", "Fort Worth", "North Richland Hills", "Watauga"],
  },
  {
    slug: "mansfield",
    name: "Mansfield",
    county: "Tarrant County",
    description:
      "Mansfield families choose TheBubbleHeros for safe, exciting foam parties right in their own backyard. Our mobile foam truck serves birthday parties, school events, and corporate picnics throughout Mansfield and the surrounding area.",
    nearbyAreas: ["Arlington", "Fort Worth", "Cedar Hill", "Grand Prairie"],
  },
  {
    slug: "cedar-hill",
    name: "Cedar Hill",
    county: "Dallas County",
    description:
      "Cedar Hill's parks and spacious backyards make an ideal setting for our foam and bubble parties. We bring professional foam cannons, kid-friendly music, and a trained operator to make your Cedar Hill event one for the books.",
    nearbyAreas: ["Mansfield", "DeSoto", "Duncanville", "Grand Prairie"],
  },
  {
    slug: "rockwall",
    name: "Rockwall",
    county: "Rockwall County",
    description:
      "Rockwall families love hosting lakeside and backyard foam parties with TheBubbleHeros. Our bubble machines and foam cannons are the perfect addition to birthday celebrations, summer gatherings, and community events across the Rockwall area.",
    nearbyAreas: ["Rowlett", "Garland", "Heath", "Royse City"],
  },
  {
    slug: "prosper",
    name: "Prosper",
    county: "Collin County",
    description:
      "Prosper's fast-growing family communities have made us one of the most-booked party services in the area. Our foam truck rolls into Prosper neighborhoods for birthday parties, HOA events, and school celebrations, delivering safe and spectacular foam fun.",
    nearbyAreas: ["Frisco", "McKinney", "Celina", "Little Elm"],
  },
];
