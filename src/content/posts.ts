import type { Post } from './types';

/**
 * Articles are written in a deliberately small markdown subset rendered by
 * `src/lib/markdown.ts`: `##`/`###` headings, paragraphs, `-` lists, `>`
 * quotes and `**bold**`. Keeping the subset narrow means no third-party
 * markdown parser ships to the browser and no untrusted HTML is ever rendered.
 */
export const posts: Post[] = [
  {
    slug: 'choosing-between-hot-finished-and-cold-formed-hollow-sections',
    title: 'Hot-finished or cold-formed? Choosing hollow sections that suit the detail',
    category: 'Engineering',
    excerpt:
      'The two hollow section standards are not interchangeable, and the difference matters most exactly where designers tend to overlook it: at the corners.',
    published: '2026-07-14',
    author: { name: 'Dr. Helena Vasquez', role: 'Technical Director' },
    tags: ['hollow sections', 'EN 10210', 'EN 10219', 'specification'],
    featured: true,
    body: `Hollow sections are specified more often than they are understood. A designer selects an SHS from a capacity table, the drawing goes out, and the procurement decision between EN 10210 hot-finished and EN 10219 cold-formed gets made by whoever is buying, usually on price. Most of the time that works out. Occasionally it produces a connection that cracks.

## What actually differs

Both standards describe a section with the same nominal dimensions and, broadly, the same nominal strength. The difference is in how the steel got there.

Hot-finished sections are formed at temperature and normalised, which relieves residual stress and produces a homogeneous, roughly isotropic material through the whole profile. Cold-formed sections are rolled and welded at room temperature, which work-hardens the material and concentrates residual stress in the corners.

That gives three practical consequences:

- **Corner radius.** Hot-finished corners are tighter, typically around 1.5 times the wall thickness. Cold-formed corners run to 2 or even 3 times. This changes the flat width available for a welded connection.
- **Corner ductility.** Cold-formed corners are work-hardened. They are stronger and less ductile, and their toughness at low temperature is reduced.
- **Residual stress.** Cold-formed sections carry locked-in stress that hot-finished sections have had normalised out.

## Where it matters

For a statically loaded column in a heated building, carrying axial load with bolted end connections, cold-formed sections are entirely appropriate and meaningfully cheaper. That describes most hollow section usage, which is why cold-formed dominates the market.

The picture changes in four situations:

- **Welding across a corner.** If a weld crosses or terminates in a cold-formed corner, it is being deposited into work-hardened, residually stressed material. In heavier walls this is a recognised cracking risk, and design codes place restrictions on it.
- **Fatigue loading.** Cyclic loading interacts badly with residual stress. For bridges, crane structures and supports carrying vibrating equipment, hot-finished is the safer selection.
- **Low temperature service.** Reduced corner toughness matters where the structure sees genuinely low temperatures. Impact-tested hot-finished material is the straightforward answer.
- **Architecturally exposed work.** The tighter corner radius of hot-finished sections reads as a crisper line. Where the steel is the architecture, this is a visible difference, not a technicality.

> If a weld lands in a corner, or the load cycles, specify hot-finished and stop thinking about it. The premium is a fraction of one investigation into a cracked connection.

## How to write the specification

Name the standard, not just the grade. "S355J2H to EN 10210-2" and "S355J2H to EN 10219-2" describe different products, and a specification that says only "S355 SHS" has delegated a structural decision to a purchasing department.

Where cold-formed is acceptable, say so explicitly. Buyers who know they have permission will find you a better price, and buyers who are guessing will either overspend or take a risk nobody sanctioned.

Where either is acceptable but connections are welded near corners, state a minimum flat width requirement instead of naming a standard. That lets the supplier solve the problem with either product.

## What we do about it

We stock both standards across the common size range, and we read connection details before we quote. Where a drawing shows a weld landing in a corner and specifies cold-formed material, we raise it as a technical query before the order is placed rather than after the section is cut.

That conversation costs us nothing and occasionally costs us the cheaper sale. It has never once cost a client a cracked connection.`,
  },
  {
    slug: 'why-mill-certificates-matter-more-than-price',
    title: 'Why mill certificates matter more than the price on the quote',
    category: 'Engineering',
    excerpt:
      'The cheapest tonne of steel is the one you cannot certify, right up until an inspector asks you to.',
    published: '2026-06-26',
    author: { name: 'Priya Raghunathan', role: 'Quality & Compliance Director' },
    tags: ['certification', 'traceability', 'EN 10204', 'quality'],
    featured: true,
    body: `Every contractor has met the quote that looks eight per cent better than everyone else's. Same grade, same sizes, same delivery window, materially lower price. It is a genuinely tempting document.

Occasionally that quote reflects a supplier with better mill terms or surplus stock to move. More often it reflects material whose documentation will not survive scrutiny.

## What a mill certificate actually asserts

An EN 10204 3.1 certificate is a statement by the manufacturer, validated by an authorised representative independent of the production department, that a specific batch of steel, identified by heat number, meets the specified chemistry and mechanical properties, evidenced by tests performed on that batch.

Three parts of that sentence carry the weight:

- **Specific batch.** The certificate relates to a heat number, and that heat number must be physically traceable to the steel in front of you through markings and delivery records.
- **Tests performed on that batch.** Not on a representative batch, not on the mill's typical output. That one.
- **Independent of production.** The person signing does not report to the person who has a tonnage target.

A 2.2 certificate, by contrast, states only that the material conforms to order, based on non-specific inspection. It is a legitimate document. It is not evidence about the steel you received, and it does not satisfy a specification calling for 3.1.

## Where the gap surfaces

It rarely surfaces at delivery. It surfaces later, and always at the least convenient moment:

- An inspector requests certification for a specific member during structural sign-off.
- A weld fails inspection, and the investigation asks what the carbon equivalent actually was.
- A defect emerges in year three, and the insurer requires the material file.
- A public client audits the project two years after completion.

At that point the material is buried in a structure. The remedy is testing in place, opening up, or replacing, and the eight per cent saved becomes a number too small to see.

## The reconciliation that should be routine

The certificate is only half of it. The other half is reconciliation: proving that the certificate in the file corresponds to the steel in the building.

That requires:

- **Heat numbers legible on delivered material**, either rolled in or hard-stamped.
- **Delivery notes referencing those heat numbers** against your order lines.
- **Cutting records** where a certified length was divided, carrying the heat number through to each piece.
- **Piece marks** on fabricated assemblies traceable back to their constituent heats.

A supplier who provides certificates but cannot reconcile them to your delivery has given you a filing cabinet, not a traceability system.

## Asking better questions

Before comparing prices, ask three questions:

**Will every line carry a 3.1 certificate matched to the delivered heat numbers?** The answer should be immediate and unqualified.

**Can you produce the certificate for a piece I select at random, from a project you completed two years ago?** A supplier with a real system will find it in minutes. A supplier without one will explain why that is difficult.

**Who signs your certificates, and who do they report to?** A supplier who understands why you are asking is a supplier worth quoting.

> A quotation is a claim about price. A certificate is a claim about steel. Only one of them still matters in year thirty.

Ask the questions first. The prices will look different afterwards.`,
  },
  {
    slug: 'embodied-carbon-in-structural-steel',
    title: 'Embodied carbon in structural steel: what the numbers actually mean',
    category: 'Sustainability',
    excerpt:
      'Recycled content, EAF routes and EPDs are quoted constantly and understood rarely. Here is how to compare structural options honestly.',
    published: '2026-06-11',
    author: { name: 'Marcus Oyelaran', role: 'Chief Executive Officer' },
    tags: ['sustainability', 'embodied carbon', 'EPD', 'specification'],
    body: `Embodied carbon has moved from a sustainability appendix to a scored tender criterion in about five years. Design teams are now asked to justify structural decisions on emissions as well as cost, frequently with numbers they have not been given the means to check.

## Two production routes, very different footprints

Almost all structural steel comes from one of two routes.

**Blast furnace / basic oxygen furnace (BF-BOF)** reduces iron ore with coke. It produces steel of consistent quality from virgin material and carries roughly 1.8 to 2.3 tonnes of CO₂e per tonne of steel.

**Electric arc furnace (EAF)** melts scrap using electricity. Its footprint is dominated by the electricity supply, and typically runs from 0.4 to 0.9 tonnes CO₂e per tonne — a factor of three or more below the BF-BOF route, and falling as grids decarbonise.

Most structural sections are EAF-produced. Most heavy plate is not. That single fact explains more variation between project carbon assessments than any design decision in them.

## What recycled content does and does not tell you

"Ninety-eight per cent recycled content" appears on a great deal of steel marketing. It is usually true and rarely the point.

Steel is endlessly recyclable, and global scrap supply is finite and fully utilised. A project specifying high recycled content does not increase the amount of scrap in circulation; it redirects existing scrap. The global emissions effect approaches zero.

What genuinely reduces emissions is:

- Choosing the **EAF route** where the specification allows it.
- Choosing mills with **decarbonised electricity supply**, which varies enormously by country and even by mill.
- Using **less steel** through efficient design.
- Designing for **reuse and disassembly**, so the section has a second life as a section rather than as scrap.

## Reading an EPD without being misled

An Environmental Product Declaration reports verified data against a defined scope. Two numbers can be entirely honest and completely incomparable if their scopes differ.

Check three things:

- **Modules covered.** A1–A3 is cradle-to-gate: raw material, transport, manufacturing. It excludes getting the steel to site (A4) and everything after. Many quoted figures are A1–A3 only.
- **Product specificity.** A mill-specific EPD for the actual product beats an industry-average EPD by a wide margin in accuracy.
- **Module D treatment.** Benefits from end-of-life recycling sit outside the system boundary in module D. Netting module D against A1–A3 produces a flattering number that is not comparable with an unnetted one.

> Compare A1–A3, product-specific, module D reported separately. Any other comparison is arithmetic dressed as analysis.

## Where the real reductions are

In our experience, across projects where the design team engaged early:

- **Design efficiency** typically saves 8 to 15% of tonnage. Right-sizing sections, revisiting spans and eliminating over-conservative connections.
- **Route and mill selection** saves 30 to 60% of the remaining footprint where the specification permits EAF material.
- **Transport optimisation** saves 2 to 5%. Real, but small compared to the other two.
- **Design for disassembly** saves nothing today and a great deal in fifty years, which is a legitimate reason to do it.

The order matters. A team that agonises over transport emissions while accepting a 20% over-specified frame has optimised the wrong variable.

## What we report

We supply EPD-backed carbon data for every tonne, stating the production route, the mill, the modules covered and whether module D is included. Our current supplied average is 0.68 tonnes CO₂e per tonne, A1–A3, module D reported separately.

We will also tell you when a lower-carbon option is available and when it is not. Both answers are more useful than a marketing figure.`,
  },
  {
    slug: 'steel-market-outlook-2026',
    title: 'Steel market outlook: what buyers should plan for in 2026',
    category: 'Market Insight',
    excerpt:
      'Capacity, energy costs and trade measures are pulling in different directions. A practical read for anyone committing to steel prices this year.',
    published: '2026-05-29',
    author: { name: 'Sofia Marchetti', role: 'Supply Chain Director' },
    tags: ['market', 'pricing', 'procurement', 'lead times'],
    body: `Steel buyers have spent four years being told the market is unusually volatile. At some point that stops being a useful description and starts being the baseline. Here is how we are reading conditions for the rest of 2026, and what we are advising clients to do about it.

## Where prices sit

Structural section prices have moved within a comparatively narrow band through the first half of the year, welcome after the swings of the preceding period, though the stability is more balanced weakness than genuine strength. Demand is soft in some segments and capacity is ample.

Plate has behaved differently. Energy infrastructure and defence demand have kept heavy plate tighter than sections, and lead times on thicker gauges have extended. Buyers treating plate and section as one market are being surprised.

Reinforcement tracks construction activity closely and regionally. It is the product where local conditions matter most and where a national average tells you least.

## What is pushing prices up

- **Energy costs** remain structurally higher than the pre-2021 baseline, and they feed directly into EAF economics.
- **Trade measures** continue to proliferate. Safeguards, quotas and anti-dumping duties have become a permanent feature rather than an episodic one, and they fragment what used to be a global price.
- **Carbon border mechanisms** are beginning to price the emissions content of imported steel, raising landed costs for high-carbon routes.
- **Decarbonisation capital expenditure** is enormous and has to be recovered. That recovery is being built into pricing over the coming decade.

## What is pushing prices down

- **Global overcapacity** persists and shows no sign of resolving.
- **Construction demand is soft** in several major markets, with higher financing costs deferring projects that would otherwise be building.
- **Scrap availability** is comfortable, keeping EAF input costs contained.

## Practical advice

**Fix your price when the programme is fixed, not before.** A twelve-week price hold on material you cannot yet take delivery of transfers risk to your supplier, and they will charge for that. If your programme is genuinely certain, fix. If it is not, a shorter validity with an agreed adjustment mechanism usually costs less.

**Separate plate from section in your risk register.** They are not moving together and they should not be planned together.

**Confirm lead times rather than assuming them.** The gap between a standard section and a heavy plate has widened substantially. A programme built on last year's lead times will find out about that late.

**Consider consignment for repeat requirements.** Where you have visibility of demand, consignment stock converts a mill lead time into a call-off. It costs something. It costs less than a stopped site.

**Ask what the quote assumes.** A price valid for fourteen days with a stated escalation basis is more useful than a price valid for ninety days with conditions that make it withdrawable.

> Certainty has a price, and so does uncertainty. The mistake is paying for certainty you do not need, or assuming you have it when you have not paid for it.

## What we are doing

We are holding deeper inventory on the sizes our clients order most, and we are being explicit about validity periods rather than quoting long and reserving the right to withdraw. Where we cannot hold a price we say so, and we say why.

That is less comfortable than the alternative. It is considerably more useful.`,
  },
  {
    slug: 'designing-for-galvanizing',
    title: 'Designing for galvanizing: the drawing review that saves a rework',
    category: 'Engineering',
    excerpt:
      'Most galvanizing problems are designed in long before the steel reaches the kettle. Six checks that catch them.',
    published: '2026-05-15',
    author: { name: 'Anders Lindqvist', role: 'Operations Director' },
    tags: ['galvanizing', 'corrosion protection', 'fabrication', 'design'],
    body: `Hot-dip galvanizing is the most reliable corrosion protection available for structural steel, and one of the least forgiving of poor detailing. A fabrication that would weld and erect perfectly can distort, trap zinc or trap air in the kettle, and by the time anyone notices, the part is coated.

Almost all of it is preventable at drawing stage. Here is what we look for when we review a job before it is galvanized.

## 1. Venting and draining

The single most common failure. A hollow assembly must let zinc in, let air out, and let zinc drain on withdrawal. Sealed voids are dangerous: trapped moisture flashes to steam at 450°C, and the consequences range from a spoiled coating to a burst section.

Vent holes should be at diagonally opposite corners, at the highest and lowest points in the dipping orientation, and sized against the enclosed volume. As a rule of thumb, 25% of the cross-sectional area for hollow sections, with a 10 mm minimum diameter.

The critical detail is that vents must be positioned relative to how the part hangs in the kettle, not how it stands in the structure. Agree the dipping orientation before locating the holes.

## 2. Distortion risk

Steel entering a 450°C bath expands, and asymmetric assemblies expand unevenly. Long, slender, asymmetric fabrications are the classic distortion case.

Reduce it by:

- Keeping material thickness as consistent as practical across an assembly
- Avoiding large differences in section size within one piece
- Using symmetrical sections where the design allows
- Breaking very long assemblies into bolted sub-assemblies
- Sequencing welds to minimise locked-in stress before dipping

## 3. Overlapping surfaces

Where two plates are lapped and welded around the perimeter, the gap between them cannot be sealed reliably. Trapped pickling acid will bleed out afterwards and stain the coating; trapped moisture is worse.

Either seal-weld the overlap fully and vent the enclosed space, or leave a designed gap of at least 2 mm so it can flood and drain. What does not work is a partial weld and hope.

## 4. Threaded connections

Zinc adds thickness, and threads are the place where that thickness has nowhere to go. Tapped holes should be tapped after galvanizing, or oversized beforehand. Nuts should be tapped oversize and supplied galvanized to ASTM A153.

## 5. Kettle dimensions

Every galvanizing plant has a maximum single-dip envelope. Exceeding it means double-dipping, which leaves a visible line where the two dips meet. On concealed steelwork that is cosmetic. On architecturally exposed steelwork it is a defect.

Our kettle takes 15.5 metres in a single dip. If your assembly exceeds that, we would rather discuss splice positions at drawing stage than explain a witness line afterwards.

## 6. Faying surfaces in slip-critical connections

Galvanized surfaces have a different slip coefficient from blast-cleaned steel. If the connection is slip-critical, the design must account for it, usually by roughening the faying surface after galvanizing, and always by using the correct coefficient in the design.

> Every one of these is a five-minute conversation at drawing stage and a five-figure conversation afterwards.

## How we handle it

We review drawings for galvanizing before fabrication starts, not before dipping. Vent locations, dipping orientation, distortion risk and kettle fit are all confirmed while changes are still cheap, and we mark up the drawing and send it back.

It has caught vent problems on roughly one job in four. That figure has not improved in ten years, which tells you how easily this detail gets missed.`,
  },
  {
    slug: 'sequenced-delivery-that-actually-works',
    title: 'Sequenced delivery: the logistics detail that decides your erection rate',
    category: 'Project Story',
    excerpt:
      'Steel arriving on the right day in the wrong order still costs you a day. What sequenced delivery involves, and what it requires from you.',
    published: '2026-04-30',
    author: { name: 'Daniel Okoro', role: 'Commercial Director' },
    tags: ['logistics', 'erection', 'programme', 'delivery'],
    body: `Ask a steel erector what slows them down and very few will say the steel arrived late. What they will describe is a trailer arriving with the right tonnage in the wrong order, and a crane standing idle while a bundle is unstrapped to reach the piece underneath.

Sequenced delivery fixes that. It is not complicated, but it does require both sides to do something.

## What it actually means

At its simplest: material is loaded so that the first piece needed is the first piece accessible.

In practice it means:

- Loads built to the **erection sequence**, not the yard's picking convenience
- Bundling by **shipping mark** so one bundle serves one area of the frame
- Marking **legible from the ground**, so a slinger identifies a piece without unstrapping
- **Delivery timed to the lift**, so material is not standing on site absorbing space and rehandling
- A **load list matching the erection drawing**, using the erector's own terminology

## What it requires from the contractor

This is where it usually breaks down, and it is worth being direct about it.

Sequenced delivery requires an **erection sequence that exists before the steel is loaded**. Not a general intention, an actual sequence, by piece mark, with dates.

It requires that sequence to be **shared early enough** to influence loading, which means weeks rather than the afternoon before.

It requires **someone on site who owns the schedule** and can confirm or change a window when the programme moves.

And it requires **honesty about slippage**. A supplier who is told on Monday that Thursday has moved can re-plan. A supplier who finds out when the driver arrives cannot.

## What it is worth

On a recent 41-storey commercial frame with no laydown area whatsoever, sequenced just-in-time delivery meant material went from trailer to crane hook without ever touching the ground. No double handling, no storage, no sorting.

The erector's own figure was a 19% improvement in pieces erected per crane hour against their benchmark for a comparable frame. On a project where crane hire is the dominant preliminary cost, that is not a marginal gain.

> The steel package did not get cheaper. The building got faster, which is worth considerably more.

## Where it does not work

Sequenced delivery suits projects with a defined erection sequence and a stable programme. It suits city-centre sites where storage does not exist. It suits frames where erection is on the critical path.

It suits far less well where the programme is genuinely uncertain, where the site has ample laydown and prefers a buffer, or where the frame is simple enough that sorting a bundle costs minutes rather than hours.

We will tell you which category your project falls into. Selling a sequenced service to a project that would be better served by a bulk delivery and a laydown area helps nobody.

## Getting it right

Three things, in our experience, separate projects where this works from projects where it does not:

**Involve the erector in the delivery plan.** They know the sequence. Building a delivery schedule without them produces a plan that reflects the programme rather than the crane.

**Agree the marking convention before fabrication.** Piece marks that match the erection drawing are worth more than any tracking system.

**Confirm windows the day before, every time.** Not as a formality — as a genuine check that the site still wants what it asked for.

None of this is sophisticated. All of it is the difference between a frame that goes up and a frame that fights you.`,
  },
  {
    slug: 'epoxa-steel-expands-fabrication-capacity',
    title: 'Expanding fabrication capacity to 850 tonnes a month',
    category: 'Company News',
    excerpt:
      'A new CNC beam line and an extended coating bay increase throughput by 40%, with capacity reserved for framework clients.',
    published: '2026-04-08',
    author: { name: 'Marcus Oyelaran', role: 'Chief Executive Officer' },
    tags: ['company news', 'fabrication', 'capacity', 'investment'],
    body: `Our fabrication facility has completed a capacity expansion that takes monthly throughput from 610 to 850 tonnes, alongside two capability additions that matter more than the headline number.

## What changed

**A second CNC beam line** now handles sections up to 1,100 mm deep, drilling, sawing and marking in a single pass. It runs alongside the existing line rather than replacing it, which means heavy sections and lighter work no longer compete for the same machine — the constraint that had been shaping our lead times for two years.

**An extended coating bay** adds 40 metres of climate-controlled throughput, taking the maximum coated length to 24 metres. Environmental conditions and dry film thickness are logged automatically against each item, so the coating record is generated by the process rather than compiled afterwards.

**Automated in-process measurement** on the profiling floor now checks critical dimensions during cutting rather than after it. Parts outside tolerance are flagged while the sheet is still on the bed.

## Why capacity, and why now

Our on-time delivery figure has held above 99% for two years, and holding it was becoming harder. Lead times were extending on complex work, and we were beginning to decline enquiries we would rather have taken.

Declining work you can deliver well is a defensible position. Accepting work you will deliver late is not. The expansion was the alternative to a slow drift toward the second.

## Reserved capacity for framework clients

A portion of the new capacity is reserved rather than sold. Framework clients now have guaranteed monthly tonnage available on call-off, which converts a lead time into a booking.

This is a deliberate choice against maximising utilisation. A shop running at 100% has no ability to absorb a client's programme change, and absorbing programme changes is a significant part of what our clients actually buy from us.

## What has not changed

The quality system, the inspection gates and the release process are unchanged. New equipment has been brought into the existing quality management system rather than run alongside it, and the additional capacity is subject to the same three-stage inspection as everything else.

We have also not increased headcount proportionally to throughput. The expansion is about removing machine constraints, not about running more shifts with less supervision.

## What comes next

A second fabrication facility is in planning, targeting monthly capacity beyond 1,400 tonnes and located to shorten delivery distances to our largest regional markets. We expect to confirm the site within twelve months.

In the meantime, lead times on fabricated packages have come in by an average of eleven days, and enquiries we would have declined six months ago are ones we can now take.`,
  },
  {
    slug: 'reading-a-steel-quotation-properly',
    title: 'How to read a steel quotation properly',
    category: 'Market Insight',
    excerpt:
      'Two quotes for the same schedule can differ by fifteen per cent and both be honest. The difference is usually in what each one silently excludes.',
    published: '2026-03-19',
    author: { name: 'Daniel Okoro', role: 'Commercial Director' },
    tags: ['procurement', 'quotations', 'commercial', 'buying'],
    body: `A steel quotation looks like a simple document: sizes, quantities, rates, total. It is one of the easier documents in construction to misread, and the errors are consistently expensive.

Here is what to check before comparing two of them.

## 1. What is the price actually for?

Steel is quoted per tonne, per metre or per piece, and the three are not interchangeable. A per-tonne rate that looks competitive can conceal a heavier section being offered against a lighter specification, more steel, more cost, same rate.

Check that the **section sizes quoted match the sizes specified**, line by line. A substitution to a heavier available section is often perfectly reasonable and occasionally the only option. It should be visible, not buried.

## 2. Is processing included?

Cutting to length, drilling, coping, cambering, marking and bundling all take shop hours. Some suppliers include them; others quote material and add processing separately, sometimes on a schedule elsewhere in the document.

The question to ask is direct: **what will arrive on my site, and what will still need doing to it?**

## 3. Delivery terms

"Delivered" covers a range. Delivered to the gate on a standard flatbed is a different service from delivered to a specified location, timed, in erection sequence, with self-offload capability.

Check the **vehicle type, the offload arrangement, the delivery window and who bears the waiting time** if the site cannot receive on schedule.

## 4. Certification level

If the specification calls for EN 10204 3.1 certification, confirm every line carries it. If a quote is materially cheaper and the certification level is unstated, that is the first thing to ask about.

## 5. Validity and escalation

Steel prices move. A quotation valid for 14 days with a clear escalation mechanism is often better value than one valid for 90 days with conditions permitting withdrawal.

Read what happens **if your programme slips**. Who carries the price movement between the original delivery date and the actual one? Silence on this point is not neutral; it means it will be argued later.

## 6. What is explicitly excluded

The exclusions list is the most informative part of most quotations and the least read. Common exclusions that surprise people:

- Site unloading and craneage
- Waiting time beyond a stated period
- Abnormal load permits and escorts
- Testing beyond standard mill certification
- Returns, offcuts and surplus material
- Price movement on delayed deliveries

## 7. Lead time versus delivery date

"Ten week lead time" and "delivered by 14 October" are different commitments. A lead time starts from something, order, drawing approval, deposit, and the start point is frequently unstated.

Ask for **a date, and the conditions attached to it**.

> The best quotation is not the lowest. It is the one where you can see everything and nothing is waiting to be discovered.

## How we quote

Line by line, showing material, processing and delivery separately. Certification level stated on every line. Validity period explicit, with the escalation basis named rather than reserved. Exclusions listed in plain language at the front, not the back.

It occasionally makes our number look higher than a competitor's. It has never made it look higher at the end of the job.`,
  },
];

export const postCategories = [
  'Engineering',
  'Market Insight',
  'Sustainability',
  'Company News',
  'Project Story',
] as const;

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

/** Newest first — the order every listing uses. */
export function getSortedPosts() {
  return [...posts].sort((a, b) => b.published.localeCompare(a.published));
}

export function getPostsByCategory(category: string) {
  return getSortedPosts().filter((post) => post.category === category);
}

/** Same category first, then most recent, excluding the current post. */
export function getRelatedPosts(slug: string, limit = 3) {
  const current = getPost(slug);
  if (!current) return [];
  const others = getSortedPosts().filter((post) => post.slug !== slug);
  const sameCategory = others.filter((post) => post.category === current.category);
  const rest = others.filter((post) => post.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export const postSlugs = posts.map((post) => post.slug);
