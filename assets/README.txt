Done — groom.jpg, bride.jpg, couple.jpg, and music.mp3 are all in this
folder and already wired up in the site:

  assets/groom.jpg   — circular portrait in the "Bride & Groom" section
  assets/bride.jpg   — circular portrait in the "Bride & Groom" section
  assets/couple.jpg  — background photo behind the opening cover section
  assets/music.mp3   — background music, plays after the guest taps
                        "Buka Undangan" (trimmed to 60s, faded in/out,
                        compressed to ~940KB so it's light on mobile data)

Nothing left to add here unless you want more — e.g. more photos for the
new "Our Moments" gallery (it's currently just showing the couple photo),
or a pre-wedding video. To add gallery photos: drop more files into this
folder (e.g. assets/moment1.jpg, assets/moment2.jpg) and list their paths
in CONFIG.gallery in js/main.js. If you'd like a video featured, upload it
and I can wire up a short looping clip in the cover or closing section —
just tell me which moment you want it in.

Tips for web performance:
  - Photos: crop to a square, resize to ~600x600px, export as .jpg at
    ~75-80% quality. Each should end up well under 300KB.
  - Music: keep it under ~3MB — trim to 30-60 seconds and loop, or use a
    128kbps mp3 encode. Guests are on mobile data.
  - If you'd like the pre-wedding video featured too, drop it in as
    assets/video.mp4 and I can wire up a short looping clip in the cover
    or closing section — just tell me which moment you want it in.
