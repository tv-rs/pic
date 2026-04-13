from PIL import Image
import os

# Base folder path
base_path = r"C:\Users\ritis\OneDrive\Desktop"

# Output folder for resized images
output_folder = os.path.join(base_path, "small_images")
os.makedirs(output_folder, exist_ok=True)

# Loop through images (us 5.png to us 12.png)
for i in range(4, 6):
    image_name = f"tanu ({i}).jpg"
    input_path = os.path.join(base_path, image_name)

    # Check if file exists
    if not os.path.exists(input_path):
        print(f"⚠️ {image_name} not found, skipping...")
        continue

    # Open image
    img = Image.open(input_path)

    # Resize while keeping aspect ratio
    new_width = 20
    aspect_ratio = img.height / img.width
    new_height = int(new_width * aspect_ratio)

    small_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # Save with unique name
    output_path = os.path.join(output_folder, f"tanu ({i})-small.jpg")
    small_img.save(output_path)

    print(f"✅ Created: {output_path}")

print("\n🎉 All small images generated successfully!")
