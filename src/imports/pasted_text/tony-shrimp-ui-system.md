Design a complete high-fidelity responsive UI/UX system for TONY SHRIMP, an Australian premium ornamental freshwater shrimp e-commerce brand.

Tony Shrimp specializes in exotic and high-grade freshwater shrimp, especially Caridina varieties and selective morphs such as:

Red Boa, Orange Boa, Blue Boa, Yellow Snowflake Galaxy, Blue Snowflake Galaxy, Red Snowflake Galaxy, Black Snowflake Galaxy, Red Fancy Tiger SS, Blue Fancy Tiger SS, Black Fancy Tiger SS, Ocean Red, Ocean Blue, Ocean Yellow, Blue Dragon, Red Dragon, Black Dragon, Black Metallic OE, Black Devil OE, Red Devil OE, and OEBT / Orange Eye variants.

Use these varieties as realistic sample products in the design.

The website should feel like:

premium aquascaping + biological specimen gallery + editorial e-commerce + restrained motion

Do NOT make it look like:

a generic pet shop
a traditional aquarium store
a Shopify template
a SaaS dashboard
a gaming/RGB website
a generic shadcn demo

The shrimp themselves must be the visual centerpiece.

Use large macro photography or isolated cut-out photography of real ornamental shrimp.

Avoid cartoon shrimp illustrations.

BRAND

Brand name:

TONY SHRIMP

Supporting label:

AUSTRALIA

Use the supplied Tony Shrimp logo as the brand mark.

Do not rebuild the whole website around the neon gradient from the logo.

Create a more mature premium system around it.

GLOBAL DESIGN SYSTEM

The entire product must support:

English
Vietnamese
Light mode
Dark mode
System theme
Desktop
Tablet
Mobile

Do not simply shrink desktop screens for mobile.

Recompose layouts when necessary.

Use a centralized design system with reusable tokens for:

colors
typography
spacing
radius
borders
shadows
motion
states

Primary accent:

natural bio-green inspired by moss, aquatic plants, algae and planted aquariums

Do NOT use neon green.

Dark mode:

near-black / charcoal background
off-white primary text
muted grey secondary text

Light mode:

white / warm off-white background
near-black primary text
soft grey secondary text

Use bio-green selectively for:

CTAs
active states
selected filters
stock status
links
order progress
focus states

Let the shrimp body colors provide most of the strong visual color.

Avoid excessive gradients, glow and glassmorphism.

DESIGN SYSTEM / UI PLAYGROUND

Create a dedicated internal page called:

/design-system

This page is NOT part of customer navigation.

It should visually document and preview the complete Tony Shrimp UI system.

Include:

Light / Dark / System switch
EN / VI switch
color tokens
typography scale
Display / Hero
H1–H4
body sizes
labels
captions
metadata
product title
price
buttons
inputs
select
checkbox
radio
switches
product cards
badges
status chips
quantity controls
cart items
modals
drawers
bottom sheets
tabs
accordions
tables
pagination
toast
empty states
skeleton states
spacing scale
grid
gutters
shadows
radius
motion examples

Show both English and Vietnamese typography examples.

Components should visually follow a refined shadcn/ui-style functional system, but the storefront itself should not look like a generic shadcn demo.

Use shadcn-style components only as the functional foundation for controls, forms, dialogs, tables, filters, admin UI, etc.

MAIN CUSTOMER NAVIGATION

Desktop:

TONY SHRIMP

Shop
About

Search

EN / VI

Theme

Account

Cart

Keep the navigation minimal and lightweight.

Mobile header:

TONY SHRIMP

Search icon
Cart icon
Menu icon

Mobile drawer:

Shop
About
My Orders
Account
Language EN / VI
Theme Light / Dark / System
Shipping
Live Arrival / DOA Policy
Contact

LANDING PAGE — HIGHEST PRIORITY

The landing page must be the strongest visual screen.

Keep it short.

Do NOT create a long generic homepage with many marketing sections.

The main experience should occupy approximately one viewport.

Create an immersive horizontal draggable shrimp collection gallery, inspired by premium editorial websites and the interaction style of the T.RICKS Menu + Slider Webflow showcase.

Use approximately 6 featured shrimp:

01 — RED BOA
02 — BLUE SNOWFLAKE GALAXY
03 — YELLOW SNOWFLAKE GALAXY
04 — BLACK FANCY TIGER SS
05 — RED DEVIL OE
06 — BLUE DRAGON

Do NOT use standard rectangular product cards.

Do NOT put featured shrimp inside colored boxes.

Display large isolated shrimp photography directly on the page background.

The composition should feel like a premium breeder collection or digital specimen exhibition.

Use:

large shrimp photography
oversized editorial typography
lots of negative space
subtle product metadata
restrained motion
minimal CTA

Example focused state:

03 / 06

BLUE SNOWFLAKE
GALAXY

Caridina · Galaxy / Snowflake

From A$40

VIEW SHRIMP →

Traits like:

SS GRADE
ORANGE EYE
BOA
GALAXY
SNOWFLAKE
FANCY TIGER

should appear as small metadata or badges.

Long names must wrap elegantly.

Example:

YELLOW
SNOWFLAKE GALAXY

or:

BLACK FANCY
TIGER

LANDING MOTION

Show conceptual motion states in the prototype.

Desktop:

horizontal click and drag
smooth inertia
arrow navigation
hover focus
subtle scale change
subtle parallax
masked / staggered text reveal

Include:

DRAG TO EXPLORE →

Shrimp may have very subtle idle movement:

slow vertical drift
very small horizontal drift
1–2 degree rotation

Motion should feel organic and underwater-inspired.

Do NOT use:

cartoon swimming
aggressive cursor following
excessive bubbles
excessive particles
RGB effects
huge blur
dramatic WebGL distortions

Respect reduced-motion accessibility.

MOBILE LANDING

Do NOT shrink the desktop free-form gallery.

Create a dedicated mobile experience.

Show primarily one shrimp at a time.

Use horizontal swipe navigation.

Example:

TONY SHRIMP

[ LARGE SHRIMP IMAGE ]

03 / 06

BLUE SNOWFLAKE
GALAXY

Caridina · Galaxy

From A$40

VIEW SHRIMP →

SWIPE TO EXPLORE

Keep touch targets large and the shrimp visually dominant.

LANDING BOTTOM SECTION

Below the gallery include only one compact store information / footer section.

Do NOT add generic marketing sections like testimonials, huge feature grids, statistics or newsletter blocks.

Include:

TONY SHRIMP AUSTRALIA

Premium ornamental freshwater shrimp for aquascapers and shrimp keepers.

Shop
Shipping
Live Arrival / DOA Policy
Order Tracking
Contact
Instagram
Facebook

Show Australia-wide shipping information.

This section may transition from a dark hero into a light footer.

SHOP PAGE

Route:

/shop

Prioritize usability over experimental motion.

Use a responsive premium product grid.

Filters:

TYPE

Caridina
Neocaridina

COLOUR

Red
Blue
Yellow
Orange
Black
White

LINE / PATTERN

Boa
Galaxy
Snowflake
Fancy Tiger
Dragon
Metallic
Devil

SPECIAL TRAIT

Orange Eye

AVAILABILITY

In Stock
Out of Stock

Desktop filters may be a sidebar or horizontal filter bar.

Mobile filters should use a bottom sheet or full-screen filter panel.

PRODUCT CARD

Product cards should be clean and restrained.

Show:

large shrimp image
product name
classification
grade / trait if applicable
AUD price
stock status

Example:

BLUE SNOWFLAKE GALAXY

Caridina · Galaxy / Snowflake

A$40

● IN STOCK

Avoid unnecessary technical details on product cards.

PRODUCT DETAIL PAGE

Route:

/products/{slug}

Desktop:

large image gallery left

purchasing information right

Mobile:

gallery first

information below

Example:

RED BOA

Caridina · Boa Line

SS Grade

A$45

● AVAILABLE

Quantity

− 1 +

ADD TO CART

Below:

WATER PARAMETERS

Temperature
pH
GH
KH
TDS

CARE LEVEL

Beginner / Intermediate / Advanced

Then:

Description
Care Information
Shipping
Live Arrival / DOA Policy

Keep technical information structured and easy to scan.

CART

Route:

/cart

Show:

shrimp image
product name
grade / trait
quantity
unit price
subtotal

Order summary:

Subtotal
Shipping
Total

Primary CTA:

CHECKOUT

CUSTOMER ORDER TRACKING

Route:

/orders/{id}

Create a strong visual status timeline:

ORDER PLACED

↓

PROCESSING

↓

SHIPPED

↓

DELIVERED

Use bio-green for completed / active states, but also include text and icons.

When shipped show:

Shipping Carrier
Tracking Number
Shipping Date

TRACK PACKAGE →

Also display:

order number
order date
products
quantity
total
shipping address

CUSTOMER ACCOUNT

Route:

/account

Include:

My Orders
Order Tracking
Profile
Addresses

Order history should be the primary content.

Example:

ORDER #TS-1042

Blue Snowflake Galaxy × 3

A$120

SHIPPED

VIEW ORDER →

ADMIN

Create a separate admin experience using the same Tony Shrimp design system.

Admin should feel operational and clean.

Do NOT use the experimental landing motion in admin.

Admin navigation:

Dashboard
Shrimp
Orders
Customers
Settings

Prioritize desktop / tablet, but make it usable on mobile.

ADMIN DASHBOARD

Route:

/admin

Show:

Processing Orders
Shipped Orders
Available Products
Low Availability
Recent Orders

Keep analytics simple.

ADMIN SHRIMP CRUD

Route:

/admin/shrimp

Desktop:

table

Mobile:

stacked cards

Columns:

Image
Name
Type
Price
Available Quantity
Status
Actions

Primary CTA:

+ ADD SHRIMP

Add / Edit fields:

Product Name
Category
Line / Pattern
Primary Colour
Grade
Special Trait
Price
Available Quantity
Description
Temperature Range
pH Range
GH Range
KH Range
TDS Range
Difficulty
Product Images
Featured
Status

Important business rule:

Tony Shrimp does NOT need warehouse receiving, exact breeding population management or birth tracking.

Shrimp reproduce naturally.

Admin only manages the quantity currently available for sale.

ADMIN ORDERS

Route:

/admin/orders

Columns:

Order
Customer
Items
Total
Date
Status
Actions

Status:

PROCESSING
SHIPPED
DELIVERED
CANCELLED

Add status filtering.

ADMIN ORDER DETAIL

Route:

/admin/orders/{id}

Display:

Order Number
Customer
Contact
Shipping Address
Products
Quantity
Payment
Total
Order Date
Current Status

Main workflow:

PROCESSING

↓

MARK AS SHIPPED

Mark as Shipped opens a dialog containing:

Shipping Carrier
Tracking Number
Shipping Date

After confirmation:

SHIPPED

Show order status history with timestamps.

Customer order tracking should visually reflect this state.

RESPONSIVE DESIGN

Create intentional layouts for:

1440 × 900 desktop
1024 × 768 tablet
390 × 844 mobile

Do not simply scale components down.

Recompose where necessary:

landing becomes swipe-first on mobile
shop filters become bottom sheet
admin tables become cards
desktop sidebars become mobile drawers
INTERNATIONALIZATION

Support:

English / Vietnamese

Example labels:

Shop / Cửa hàng
Cart / Giỏ hàng
Account / Tài khoản
My Orders / Đơn hàng
Add to Cart / Thêm vào giỏ
In Stock / Còn hàng
Processing / Đang xử lý
Shipped / Đã gửi
Delivered / Đã giao

Components must adapt to longer Vietnamese text.

Do not embed text inside images.

ACCESSIBILITY

Ensure:

sufficient contrast in light and dark mode
visible focus states
keyboard navigation
readable font sizes
large mobile tap targets
semantic controls
reduced-motion support
order status communicated with text/icons as well as color
FINAL PRIORITY

Visual priority:

Landing page
Shop
Product detail
Mobile experience
Cart and order tracking
Admin
Design system consistency

The final result should feel unmistakably like:

TONY SHRIMP — a premium Australian ornamental shrimp breeder and modern e-commerce brand

Use real shrimp photography as the visual focus.

Use restrained motion.

Use premium editorial composition.

Keep functional UI clean and shadcn-inspired.

Do not make the storefront look like a generic component library demo.