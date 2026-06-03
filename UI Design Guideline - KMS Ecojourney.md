**UI Design Guideline**  
**Knowledge Management System (KMS) Ecojourney**

**1\. Prinsip Desain (Design Principles)**  
Desain antarmuka KMS harus mencerminkan kearifan lokal sekaligus mempertahankan standar akademis yang profesional. Prinsip utama yang digunakan adalah:

* **Organik & Natural:** Menggunakan elemen visual yang mencerminkan alam dan keberlanjutan.  
* **Inklusif & Aksesibel:** Memastikan antarmuka mudah digunakan oleh berbagai kalangan, dari masyarakat desa hingga akademisi.  
* **Terstruktur & Jelas:** Menampilkan data secara hierarkis agar mudah dicari dan dibaca.

**2\. Palet Warna (Color Palette)**

| Kategori Warna | Warna | Kode HEX | Penggunaan Utama |
| :---: | :---: | :---: | :---: |
| Primary | ![][image1] | \#284027 | Identitas utama, header, footer, primary button |
|  | ![][image2] | \#D5E2C4 | Aksen sekunder, background, batas pemisah kategori. |
| Secondary | ![][image3] | \#7A5535 | Background cards, background kategori |
| Neutral Color | ![][image4] | \#F2F2F2 | Page background |
|  |  | \#FFFFFF | Cards background, background pemisah kategori |
| Semantic Color | ![][image5] | \#EB3131 | Delete, cancel, tolak |
|  | ![][image6] | \#02E10E | Add, finish, agree |
|  | ![][image7] | \#384166 | Edit |

**3\. Tipografi**

Font menggunakan **Plus Jakarta Sans**

| Elemen Teks | Ukuran (Font Size) | Ketebalan (Weight) |
| :---: | :---: | :---: |
| Heading 1 (H1) | 36px | ExtraBold |
| Heading 2 (H2) | 20px | ExtraBold |
| Body Text (Paragraf) | 20px | Regular |
| Caption & Keterangan | 16px | Regular |

**4\. Komponen Antarmuka (UI Components)**

**4.1. Tombol (Buttons)**

* **Primary Button:** Latar belakang hijau (\#284027), teks putih, tanpa garis tepi, corner radius 5\. Digunakan untuk aksi utama seperti "Add Data" atau "Add Pengetahuan".  
* **Secondary Button:** Latar belakang semantic color, teks putih, tanpa garis tepi, corner radius 5.. Digunakan untuk aksi seperti "Finish" atau "Cancel".

**4.2. Kartu Informasi (Cards)**

* **Batas & Bayangan:** Tanpa garis tepi tipis dan bayangan sangat lembut (*drop shadow*).

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH8AAABMCAYAAABEU2gQAAABaklEQVR4Xu3c3W3CMBhAUdZp6c8IbfcfqlWUWkmMJ+DchyORL4+XWDgBbu9fL78x3eZBHMWHFR9WfBgZ//Pn7d/94ZyEi79Fn2cqLn4ObPyP71d+FSDj69EHLn7hD2T8K/cTPxc/h+LDig8rPqz4sOLDyPjnrd58TsLFn4PPxxIw/vWmznws4eJvWvZ3XPw5+HwsKX7xLS37OzJ+dsWHFR9WfFjxYcWH0fHb6i2Ggvb5aPzxMKf4i6Gi+IvhMzs/wi3+Yqgo/mKoKP5iGEPxYcWHFR9WfFjxYWT8/b7+va3ePHh284805DcAGL+vbg/F7+dajsf4XfmU7Q8Yx+viY8a/b8pL/oaMn13xYcWHFR9WfFjxYWT8HuzsuPhz8PMNHw0X/6ybPIuhYF4BRGR8/YofuPhd8Qcy/pW7CnDxcyg+rPiw4sOKDys+jIs/b/Xm8xIu/pm8x9+w8fWrfsPGDxpfX+4HNH5L/uYPT1CFiOuo1CQAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI4AAABVCAYAAACfBNzkAAAB00lEQVR4Xu3cQW7UMACF4d7/XqUXoLCjcBKQiyLcN7Fr3vpbfJpJZvvLjmKPn77/evkN/+spb8AJ4VARDhXhUBEOFeGErz+eP8jf+Us44dvPLx+uX8VzSzhBOGeEEzKccZ33EM6DjOT17fnhHsJ5kJF4QL4nnHCNMONTNGvCoSIcKsKhIhwqwqEiHCrCoSKccC0xWGrYE04YL/7yHo+EMzHKnBPOZIw211LDIKI14UwyFGtVa8LZEM6acCYZSl7zj3DC9Yxjy+iecKgIh4pwqAiHinCoCIeKcKgIJzh04IxwQq5XcU84QThnhBNMVWeEE4w4Z4QThHNGOOE6dMA20j3hUBEOFeFQEQ4V4VARDhXhUBFOGP9usNzwOeFM8kxj8awJZ0M4a8JZeD+AQDhLwgljqjLSfE44kxGNg5XOCGdipDknnEnu/hPSmnCoCIeKcKgIh4pwqAiHinCoCCdch2Rf197l3BPO5H3JIUKxDHFPOBOjyznhTIRzTjgT4ZwTTsh4POPcE064juQf323qWhMOFeFQEQ4V4VARDhXhUBEOFeEseH+zJ5wFb4v3hHNjjDbC2RNOuKYo4ewJZzI/1whnTziTsfvv2jpqutoTzoJo9v4ADzat069XopcAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJsAAABcCAYAAAB5jMeAAAACJUlEQVR4Xu3cQXabMBSG0ayr6TribiTu8tPihJBgEJYe55/kDu5EePgdga2Hn15ffr0x7u+f33drbHtaL9BHbI8TW8H18iy2DmIrEFsfsREjNmLERozYiBEbMWIjRmzEiI0YsREjthPcThEuz3frfCe2E0yxObY6Jrai60dkU2zTWen6OguxFc07mkP5Y2IruF6+3z7F1ia2gq245tsq98RWMH8xWFt/jndiG7S3g4ltn9gGtaJqXfvJxDaoFVTr2k8mNmLERozYiBEbMWIjRmzEiI0YsREjNmLEVrA+gHdy0Ca2gmmebb3GPrENm0bAjYH3ENugeVebb597I0csxDboM7KPl1w8sx0T24nE1ia2E4mtTWyDtt4RFVub2AZ9vsbnme1hYqv6H9vWLsc9sREjNmLERozYiBEbMWIjRmzEiI0YsREjtoL1SLjjqjaxFTim6iO2YcbCe4ltkLHwfmIb9HUkfOKv6Y+J7URiaxPbicTWJrZBW2FtrbEQ2yBj4f3EVmUs/GFiI0ZsxIiNGLERIzZixEaM2IgRGzFiK5p+0DVe9BixFcxzbBMzbcfENmjrHHRrjYXYTiS2NrGdZL6VrtdZiK1oHi26PbOZ/mgS24nsbG1iO9H7t1G72x6xDdraxbbWWIit4Ovzmme2Y2KrMhb+MLERIzZixEaM2IgRGzFiI0ZsxIiNGLEV3EbCV9afYSG2AmehfcRWYCfrI7ZBQuv3D1UuT7/oEqbPAAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAABYCAYAAADxysViAAABmElEQVR4Xu3cPY7CMBSFUfa/WX42MCMKJOZBeR1nrk5xijxcfkoMMrk8Ho+fBtfr9WPGsS5z8F+Jab+qmO73+x9zDWtVxTRnHEtMxIiJGDERUxMT+4mJGDERIyZixESMmIgREzFiIkZMxFTF9PwV/GV+xno1Mc2A5jXrVcR0u90+4nmdb5prWacipm9mXKxXGZO70h5VMdl871UTk4j2q4jp+UgT034VMb2+zc1/p9g3HasiJs5BTMSIiRgxESMmYsREjJiIERMxYiKmJqb3U5bv5jrWqYppzjiWmIgREzFVMTkxsFdVTHPGscREjJiIERMxNTGxn5iIERMxYiJGTMSIiRgxESMmYsRETFVMTljuVRPTDGhes15FTN5peQ4VMX0z42K9ypjclfaoisnme6+amES0n5iIqYjJOy3PoSImzkFMxIiJGDERIyZixESMmIgREzFiIqYmpvdTlu/mOtapimnOOJaYiBETMVUxOTGwV1VMc8axxESMmIgREzE1MbGfmIgREzFiIkZMxIiJGDERIyZixETML3aLq9ixe7ZSAAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJsAAABcCAYAAAB5jMeAAAACCUlEQVR4Xu3dMY7bMBRF0VlX0sX7bzPJahIwhgBBJoZf/M6rTnEAg1Z5QcmiRH/8fnz/Awkf1wH4X8RGjNiIERsxYiNGbMSIjRixFfz88e3Fr8lxfE1sBbOwRnDXMb4mtgKxvYfYCsT2HmIruF6vCW2P2ArMbO8htoJZbJ9iu01sBbPYzGz3ia3g8/EM7jBmNbHdJzZixEaM2IgRGzFiI0ZsxIiNGLERIzZixFY0Vg2sh/aIrWAsTR2xHZ+vx7AmtoXZGuhsjDWxbRDbHrHd5ImPfWIrOj8SPnu+jTWxbTCz7RHbhnEqNbvdJ7aF2Sw2G2NNbAXn67XnfbbXY1gTW9Hx/sF1nDqxESM2YsRGjNiIERsxYiNGbMSIjRixFbmh2ye2IuuhfWJbOK+JXr/jHrEVia1PbEVi6xNbkdj6xFYktj6xFYmtT2xFYusTW5HY+sRGjNiIERsxYiNGbMSIjRixESM2YsRGjNgKjt0mPUTZI7aFsWPReXdw25zuE9vCLKzZGGtiu2m8ZSW2PWIr+vff8I9naF7r2yO2m/xI2Ce2DWLbI7aFcep8GRPbFrEtXK/R/EDYJ7aC8w3dwW7he8RGjNiIERsxYiNGbMSIjRixESM2YsRGjNiKLFH1ia3Aeuh7iG3hvCZ6/Y57xFYktj6xFYmtT2xFYusTW5HY+sRWJLY+sRWJre8vvJkkXLz/RvkAAAAASUVORK5CYII=>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJsAAABcCAYAAAB5jMeAAAACH0lEQVR4Xu3dQU4jMRCGUe7GnCWceWDuAkorYaBxXMYq/au3eAtMLz857XQleXr59+edscvf5/eXtwfrg+uZezov8N+jqC6v43XmxDZxje1iZ2sjtonrDjYKa7RGTWyFc1iPAqQmtgXHy+md+7VtYiNGbMSIjRixESM2YsRGjNiIERsxYiNGbJW3708QfvyfZWKbuYV2//s6ASK4fWKbOMI6jRiN1lgjtl+ys+0T2y8c40WmPraJbcF9hm00tcs6sRXco/UR24Sp3F5im/DS2UtsE9/Gwb9ySNgiNmLERozYiBEbMWIjRmzEiI0YsREjNmLEVvjx9ODmfB01sRWE1UdsBbH1EVtBbH3EVjjfq4lvn9gKR1zXmbavBtdRE1vBTtZHbAWx9RFbQWx9xFY4Hw4cEvaJjRixESM2YsRGjNiIERsxYiNGbMSIjRixLfDEoIfYFoith9hmbvNrYushtgVi6yG2BWLrIbYFYushtgVi6yG2BWLrIbYFYushtgVi6yE2YsRGjNiIERsxYiNGbMSIjRixESM2YsRWuQ1Pfv5OvKcJ28RWOMd1D+98HTWxTTzayUZr1MQ2ccQ2+A5dse0R28QRldjaiG1CbL3ENvHoMCC2PWKbuLwOwvI50m1iKxzvr912t2F8LBPbouNUOrh/Y53YiBEbMWIjRmzEiI0YsREjNmLERozYCsfTg/PPdntzd4vYCvcByrPzddQ+ALi+lkwtVrLVAAAAAElFTkSuQmCC>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJsAAABcCAYAAAB5jMeAAAACMUlEQVR4Xu3dQXLbIACG0Vyr8a7JTdLe/wjtOBoGFVODQfOv3uJNLKLlN7IkkPz24+fXH9a9f/z6dvv8/f23/T/VWzvAa+6RFWJ7TmwXugfXjlGJbVHvKHb7fByjEtui3lGsN0Yltg3n87VvnaMdldiIERsxYiNGbMSIjRixESM2YsRGjNiIEduGdgahN19KJbYN57nQsqat3YdKbIt6YZWFlO04B7Etui8nasPqBUgltg3nc7Xyud2HSmwbzhcFYhsT26JeWO8f/RW8HMS2qBfbs3HEtqx3X01oz4ltQzlPO2v3oRIbMWIjRmzEiI0YsREjNmLERozYiBEbMWK7iNmDMbFdwFTVHLFd4L5qV2xjYttUIhPbmNg2nAMT25jYFlnL9jqxLWrjard5JLZFx0XB2f2K9PHxPiqxXcSRbUxsFxHbmNiIERsxYiNGbMSIjRixESM2YsRGjNiIEdsmMwfzxLbBG8JfI7ZF5c3gYpsntk1imye2TWKbJ7ZNYpsntk1imye2TWKbJ7ZNYpsntk1imyc2YsRGjNiIERsxYiNGbMSIjRixESM2YsS24XhN1vEjt+Vzuw+V2Da0cbXb/Etsi4T1OrEtKrGVr8/j6/RxPyqxLTqfrx3bHn4ZEduiXljliat2nIPYFvViO8bF9j9iW9SL6ubI9pTYNhznbeWczX22EbFdwNFsjtiIERsxYiNGbMSIjRixESM2YsRGjNg2lVW6buyOiW3DeZmR6aqxv2u60wJCZ09eAAAAAElFTkSuQmCC>