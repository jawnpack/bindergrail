// Intrinsic dimensions for every image under public/images/blog/.
// next/image needs explicit width/height to reserve layout space (no CLS).
// When adding a new blog image, add its dimensions here
// (`sips -g pixelWidth -g pixelHeight <file>` on macOS).
export const BLOG_IMAGE_DIMENSIONS: Record<
  string,
  { width: number; height: number }
> = {
  "/images/blog/booster-box-msrp.jpg": { width: 730, height: 1000 },
  "/images/blog/booster-box-sealed-acrylic.jpg": { width: 730, height: 1000 },
  "/images/blog/booster-box-sealed.jpg": { width: 960, height: 960 },
  "/images/blog/booster-box-stack.jpg": { width: 750, height: 750 },
  "/images/blog/booster-box-timeline.jpg": { width: 597, height: 800 },
  "/images/blog/card-show-vendor.jpg": { width: 640, height: 640 },
  "/images/blog/discord-notification-screenshot.jpg": { width: 768, height: 536 },
  "/images/blog/facebook-marketplace-singles.jpg": { width: 320, height: 676 },
  "/images/blog/featured-pokemon-comparison.jpg": { width: 1400, height: 787 },
  "/images/blog/illustration-rare-comparison.jpg": { width: 1400, height: 787 },
  "/images/blog/modern-vs-vintage-comparison.jpg": { width: 1400, height: 787 },
  "/images/blog/psa-10-modern-card.jpg": { width: 1000, height: 666 },
  "/images/blog/psa-graded-cards.jpg": { width: 1599, height: 1242 },
  "/images/blog/restock-queue.jpg": { width: 1080, height: 1440 },
  "/images/blog/target-pokemon-section.jpg": { width: 1080, height: 1440 },
  "/images/blog/target-restock-shelf.jpg": { width: 1080, height: 1440 },
  "/images/blog/upc-storage.jpg": { width: 900, height: 635 },
  "/images/blog/vintage-sealed-box.jpg": { width: 517, height: 550 },
  "/images/blog/walmart-pokemon-restock.jpg": { width: 640, height: 853 },
};
