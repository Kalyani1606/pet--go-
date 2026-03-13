# Download missing product images from Unsplash
# Each URL is a direct Unsplash CDN link to a relevant, high-quality image

$imageDir = "product_images"

$images = @{
    # DOG
    "dog_food_pedigree.jpg" = "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=750&fit=crop"
    "dog_harness.jpg" = "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=600&h=750&fit=crop"

    # CAT
    "cat_wet_food.jpg" = "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=750&fit=crop"
    "cat_treats.jpg" = "https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=600&h=750&fit=crop"
    "cat_litter_box.jpg" = "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=600&h=750&fit=crop"
    "cat_litter_sand.jpg" = "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=750&fit=crop"

    # BIRD
    "bird_seed_mix.jpg" = "https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=600&h=750&fit=crop"
    "bird_parrot_pellets.jpg" = "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=750&fit=crop"
    "bird_cage.jpg" = "https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=600&h=750&fit=crop"
    "bird_swing_toy.jpg" = "https://images.unsplash.com/photo-1591198936750-16d8e15edb9e?w=600&h=750&fit=crop"
    "bird_water_dispenser.jpg" = "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&h=750&fit=crop"
    "bird_cuttlefish_bone.jpg" = "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=600&h=750&fit=crop"

    # FISH
    "fish_aquarium_tank.jpg" = "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600&h=750&fit=crop"
    "fish_aquarium_filter.jpg" = "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&h=750&fit=crop"

    # RABBIT
    "rabbit_food_pellets.jpg" = "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=750&fit=crop"
    "rabbit_hay.jpg" = "https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=600&h=750&fit=crop"
    "rabbit_cage.jpg" = "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=600&h=750&fit=crop"

    # HAMSTER
    "hamster_wheel.jpg" = "https://images.unsplash.com/photo-1425082661507-d6d2f51f7c68?w=600&h=750&fit=crop"
    "hamster_bedding.jpg" = "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=750&fit=crop"

    # GENERAL PET CARE
    "care_brush.jpg" = "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&h=750&fit=crop"
    "care_travel_carrier.jpg" = "https://images.unsplash.com/photo-1583337130417-13104dec14a3?w=600&h=750&fit=crop"
    "care_first_aid_kit.jpg" = "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&h=750&fit=crop"
    "care_cleaning_wipes.jpg" = "https://images.unsplash.com/photo-1581888227599-779811939961?w=600&h=750&fit=crop"
}

$total = $images.Count
$current = 0

foreach ($entry in $images.GetEnumerator()) {
    $current++
    $outPath = Join-Path $imageDir $entry.Key
    Write-Host "[$current/$total] Downloading $($entry.Key)..." -ForegroundColor Cyan
    try {
        Invoke-WebRequest -Uri $entry.Value -OutFile $outPath -UseBasicParsing -TimeoutSec 30
        Write-Host "  OK - saved to $outPath" -ForegroundColor Green
    } catch {
        Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nDone! Downloaded $current images." -ForegroundColor Yellow
