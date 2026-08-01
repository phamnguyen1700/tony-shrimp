export type ShrimpType = 'Caridina' | 'Neocaridina'
export type ShrimpStatus = 'in-stock' | 'low-stock' | 'out-of-stock'
export type CareLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface WaterParams {
  tempMin: number
  tempMax: number
  phMin: number
  phMax: number
  ghMin: number
  ghMax: number
  khMin: number
  khMax: number
  tdsMin: number
  tdsMax: number
}

export interface ShrimpProduct {
  id: string
  slug: string
  name: string
  nameParts: string[]
  classification: string
  type: ShrimpType
  lines: string[]
  colors: string[]
  grade?: string
  specialTraits?: string[]
  price: number
  status: ShrimpStatus
  quantity: number
  description: string
  careLevel: CareLevel
  waterParams: WaterParams
  imageKey: string
  featured: boolean
  traits: string[]
  number: string
}

export const shrimpProducts: ShrimpProduct[] = [
  {
    id: '1',
    slug: 'red-boa',
    name: 'RED BOA',
    nameParts: ['RED', 'BOA'],
    classification: 'Caridina · Boa Line',
    type: 'Caridina',
    lines: ['Boa'],
    colors: ['Red'],
    grade: 'SS',
    specialTraits: [],
    price: 45,
    status: 'in-stock',
    quantity: 18,
    description: 'The Red Boa is a spectacular Caridina morph displaying bold crimson and cream banding along its rostrum in the classic Boa pattern. Each specimen exhibits unique stripe intensity — no two are identical. Bred selectively for deep red saturation and sharp contrast.',
    careLevel: 'Advanced',
    waterParams: { tempMin: 20, tempMax: 24, phMin: 5.8, phMax: 6.8, ghMin: 4, ghMax: 6, khMin: 0, khMax: 1, tdsMin: 100, tdsMax: 150 },
    imageKey: 'red-boa',
    featured: true,
    traits: ['BOA', 'SS GRADE'],
    number: '01',
  },
  {
    id: '2',
    slug: 'blue-snowflake-galaxy',
    name: 'BLUE SNOWFLAKE GALAXY',
    nameParts: ['BLUE', 'SNOWFLAKE GALAXY'],
    classification: 'Caridina · Galaxy / Snowflake',
    type: 'Caridina',
    lines: ['Galaxy', 'Snowflake'],
    colors: ['Blue'],
    grade: 'SS',
    specialTraits: ['Orange Eye'],
    price: 40,
    status: 'in-stock',
    quantity: 12,
    description: 'A breathtaking morph combining the Galaxy nebula patterning with Snowflake overlay in iridescent blue. Orange Eye trait adds a brilliant focal point. Among the most visually striking Caridina available in the hobby.',
    careLevel: 'Advanced',
    waterParams: { tempMin: 20, tempMax: 24, phMin: 5.8, phMax: 6.8, ghMin: 4, ghMax: 6, khMin: 0, khMax: 1, tdsMin: 100, tdsMax: 150 },
    imageKey: 'blue-snowflake-galaxy',
    featured: true,
    traits: ['GALAXY', 'SNOWFLAKE', 'ORANGE EYE', 'SS GRADE'],
    number: '02',
  },
  {
    id: '3',
    slug: 'yellow-snowflake-galaxy',
    name: 'YELLOW SNOWFLAKE GALAXY',
    nameParts: ['YELLOW', 'SNOWFLAKE GALAXY'],
    classification: 'Caridina · Galaxy / Snowflake',
    type: 'Caridina',
    lines: ['Galaxy', 'Snowflake'],
    colors: ['Yellow'],
    grade: 'SS',
    specialTraits: [],
    price: 38,
    status: 'in-stock',
    quantity: 9,
    description: 'The Yellow Snowflake Galaxy presents an almost translucent golden-lime body with delicate snowflake patterning. A rarer colour variant of the Snowflake Galaxy line — its amber-tinged carapace and distinctive antennae make it immediately recognisable.',
    careLevel: 'Advanced',
    waterParams: { tempMin: 20, tempMax: 24, phMin: 5.8, phMax: 6.8, ghMin: 4, ghMax: 6, khMin: 0, khMax: 1, tdsMin: 100, tdsMax: 150 },
    imageKey: 'yellow-snowflake-galaxy',
    featured: true,
    traits: ['GALAXY', 'SNOWFLAKE', 'SS GRADE'],
    number: '03',
  },
  {
    id: '4',
    slug: 'red-snowflake-galaxy',
    name: 'RED SNOWFLAKE GALAXY',
    nameParts: ['RED', 'SNOWFLAKE GALAXY'],
    classification: 'Caridina · Galaxy / Snowflake',
    type: 'Caridina',
    lines: ['Galaxy', 'Snowflake'],
    colors: ['Red'],
    grade: 'SS',
    specialTraits: [],
    price: 42,
    status: 'low-stock',
    quantity: 5,
    description: 'Rich crimson with the unmistakable Snowflake Galaxy overlay. Deep red pigmentation with contrasting white fleck patterning across the full body. A highly sought morph with limited availability.',
    careLevel: 'Advanced',
    waterParams: { tempMin: 20, tempMax: 24, phMin: 5.8, phMax: 6.8, ghMin: 4, ghMax: 6, khMin: 0, khMax: 1, tdsMin: 100, tdsMax: 150 },
    imageKey: 'red-snowflake-galaxy',
    featured: true,
    traits: ['GALAXY', 'SNOWFLAKE', 'SS GRADE'],
    number: '04',
  },
  {
    id: '5',
    slug: 'orange-boa',
    name: 'ORANGE BOA',
    nameParts: ['ORANGE', 'BOA'],
    classification: 'Caridina · Boa Line',
    type: 'Caridina',
    lines: ['Boa'],
    colors: ['Orange'],
    grade: 'SS',
    specialTraits: [],
    price: 45,
    status: 'in-stock',
    quantity: 14,
    description: 'Bold amber and black Boa patterning on a vibrant orange base. The Orange Boa displays the characteristic elongated rostrum and dramatic saddle markings that define the Boa line, in a warm tangerine-to-burnt-sienna palette.',
    careLevel: 'Advanced',
    waterParams: { tempMin: 20, tempMax: 24, phMin: 5.8, phMax: 6.8, ghMin: 4, ghMax: 6, khMin: 0, khMax: 1, tdsMin: 100, tdsMax: 150 },
    imageKey: 'orange-boa',
    featured: true,
    traits: ['BOA', 'SS GRADE'],
    number: '05',
  },
  {
    id: '6',
    slug: 'blue-boa',
    name: 'BLUE BOA',
    nameParts: ['BLUE', 'BOA'],
    classification: 'Caridina · Boa Line',
    type: 'Caridina',
    lines: ['Boa'],
    colors: ['Blue'],
    grade: 'SS',
    specialTraits: ['Orange Eye'],
    price: 50,
    status: 'in-stock',
    quantity: 8,
    description: 'One of the rarest Boa variants — deep midnight blue with the signature serpentine banding of the Boa line. Orange Eye variant. The Blue Boa has an almost iridescent quality under aquarium lighting, shifting from slate to cobalt depending on the angle.',
    careLevel: 'Advanced',
    waterParams: { tempMin: 20, tempMax: 24, phMin: 5.8, phMax: 6.8, ghMin: 4, ghMax: 6, khMin: 0, khMax: 1, tdsMin: 100, tdsMax: 150 },
    imageKey: 'blue-boa',
    featured: true,
    traits: ['BOA', 'ORANGE EYE', 'SS GRADE'],
    number: '06',
  },
  {
    id: '7',
    slug: 'ocean-red',
    name: 'OCEAN RED',
    nameParts: ['OCEAN', 'RED'],
    classification: 'Caridina · Ocean Line',
    type: 'Caridina',
    lines: ['Dragon'],
    colors: ['Red', 'Orange'],
    grade: 'S',
    specialTraits: [],
    price: 35,
    status: 'in-stock',
    quantity: 20,
    description: 'The Ocean Red presents a warm amber-to-copper gradient with distinctive mottled patterning. Slightly more accessible than the premium Boa line while retaining excellent colour saturation and active personality.',
    careLevel: 'Intermediate',
    waterParams: { tempMin: 20, tempMax: 25, phMin: 6.0, phMax: 7.0, ghMin: 5, ghMax: 8, khMin: 0, khMax: 2, tdsMin: 120, tdsMax: 180 },
    imageKey: 'ocean-red',
    featured: false,
    traits: ['S GRADE'],
    number: '07',
  },
  {
    id: '8',
    slug: 'ocean-blue',
    name: 'OCEAN BLUE',
    nameParts: ['OCEAN', 'BLUE'],
    classification: 'Caridina · Ocean Line',
    type: 'Caridina',
    lines: ['Dragon'],
    colors: ['Blue', 'Black'],
    grade: 'S',
    specialTraits: [],
    price: 35,
    status: 'low-stock',
    quantity: 4,
    description: 'Deep indigo with translucent yellow-green undersides and distinctive blue saddle patterning. The Ocean Blue has a refined, understated palette compared to the Snowflake Galaxy variants — elegant without ostentation.',
    careLevel: 'Intermediate',
    waterParams: { tempMin: 20, tempMax: 25, phMin: 6.0, phMax: 7.0, ghMin: 5, ghMax: 8, khMin: 0, khMax: 2, tdsMin: 120, tdsMax: 180 },
    imageKey: 'ocean-blue',
    featured: false,
    traits: ['S GRADE'],
    number: '08',
  },
  {
    id: '9',
    slug: 'black-fancy-tiger-ss',
    name: 'BLACK FANCY TIGER SS',
    nameParts: ['BLACK FANCY', 'TIGER'],
    classification: 'Caridina · Fancy Tiger',
    type: 'Caridina',
    lines: ['Fancy Tiger'],
    colors: ['Black'],
    grade: 'SS',
    specialTraits: [],
    price: 48,
    status: 'out-of-stock',
    quantity: 0,
    description: 'Jet-black with sharp contrasting white banding in the classic Fancy Tiger pattern. The SS Grade Black Fancy Tiger represents peak expression of the morph — deep obsidian colouring with razor-defined white stripes. Currently out of stock — notify me when available.',
    careLevel: 'Advanced',
    waterParams: { tempMin: 20, tempMax: 24, phMin: 5.8, phMax: 6.8, ghMin: 4, ghMax: 6, khMin: 0, khMax: 1, tdsMin: 100, tdsMax: 150 },
    imageKey: 'blue-snowflake-galaxy',
    featured: false,
    traits: ['FANCY TIGER', 'SS GRADE'],
    number: '09',
  },
  {
    id: '10',
    slug: 'red-devil-oe',
    name: 'RED DEVIL OE',
    nameParts: ['RED DEVIL', 'OE'],
    classification: 'Caridina · Devil / OE',
    type: 'Caridina',
    lines: ['Devil'],
    colors: ['Red'],
    grade: 'SS',
    specialTraits: ['Orange Eye'],
    price: 55,
    status: 'low-stock',
    quantity: 3,
    description: 'A fearsome and rare morph — deep scarlet Devil patterning with the sought-after Orange Eye trait. The Red Devil OE is a collector-level specimen with intense ruby colouring and the characteristic bold saddle markings of the Devil line.',
    careLevel: 'Advanced',
    waterParams: { tempMin: 20, tempMax: 24, phMin: 5.8, phMax: 6.8, ghMin: 4, ghMax: 6, khMin: 0, khMax: 1, tdsMin: 100, tdsMax: 150 },
    imageKey: 'red-boa',
    featured: false,
    traits: ['DEVIL', 'ORANGE EYE', 'SS GRADE'],
    number: '10',
  },
]

export const featuredShrimp = shrimpProducts.filter(s => s.featured)
