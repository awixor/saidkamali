# How to Add New Lessons

1. Go to `/admin` and log in
2. Navigate to **Videos** collection
3. Click **Create New**
4. Fill in the fields:
   - **youtubeId**: The YouTube video ID (from the URL after `v=`)
   - **title**: Arabic title, e.g. "الدرس 4 – بَاب وُقُوتِ الصَّلاَة"
   - **lessonNumber**: The lesson number (e.g. 4)
   - **book**: Select the book this lesson belongs to
   - **chapter**: The باب name within the book
   - **publishedAt**: Publication date (optional)
   - **durationMinutes**: Video duration in minutes (optional)
5. Click **Save**

## Adding a New Book

1. Go to `/admin` > **Books** collection
2. Click **Create New**
3. Fill in:
   - **slug**: URL-friendly name, e.g. "al-hajj"
   - **name**: Arabic name, e.g. "كتاب الحج"
   - **order**: Number for sorting (comes after existing books)
   - **coverVideoId**: Optional - select a video whose thumbnail will be used as the book cover
4. Click **Save**
