# Inside the Pyramids

See-through 3D models of seven Egyptian pyramids, the Great Sphinx and two royal tombs: Djoser's Step Pyramid and Unas at Saqqara, the Bent and Red pyramids at Dahshur, Khufu, Khafre, the Sphinx and Menkaure at Giza, and the tombs of Tutankhamun (KV 62) and Seti I (KV 17) in the Valley of the Kings. Every known passage and chamber is drawn to published survey figures; the two tombs use the Theban Mapping Project survey.

- A **monument picker** shows all ten side by side at the same scale, grouped by site, with arrows to step through them in date order.
- Click any passage or chamber to see a photo, fly the camera to where it was taken, and read why it matters.
- **Guided tours** walk you through each pyramid's real route, stop by stop.
- Links can open a single feature, for example `#khufu/king` or `#unas/ptAE`.
- **Timeline** view: when each pyramid was built, by dynasty and reign.
- **Map** view: where the pyramids stand along the Nile, with to-scale plans of Giza and Dahshur.
- Human figures (1.75 m) for scale, inscriptions and builders' marks, and neighbouring monuments in 3D.
- **Stone look** with textured stone, and **walk mode** at human eye height with a side-view minimap.
- **Satellite map** with annotated sites (Esri World Imagery).
- Labels name whatever is near you as you zoom in, and a compass card says where you are (side, height, nearest feature), with a colour key.
- Entrances show as real openings in the outer face, cut into the stepped core in the "Today" look.
- **Pyramid Texts, wall by wall**: click any inscribed wall in the Pyramid of Unas to read what its spells are about; the antechamber walls show photographs of the real texts.

Each feature is tagged *Surveyed*, *Approximate* or *Uncertain* according to how sure the published figures are. Photo viewpoints are estimated from the photos.

## Running it

It is a static site with no build step. Serve the folder with any web server (for example `python3 -m http.server`) and open `index.html`, or visit the GitHub Pages site.

## Files

| Path | What it is |
|---|---|
| `index.html` | Page structure: panels, toolbar, welcome card |
| `css/style.css` | All styles |
| `js/viewer.js` | The viewer: scene, looks, navigation, walk mode, tours, labels, timeline and map |
| `js/pyramids/*.js` | One file per pyramid: measurements, features, photos and tour route |
| `photos/` | Photographs and drawings (credits below) |
| `preview.jpg` | Image shown when the link is shared |

To add a pyramid, copy one of the files in `js/pyramids/`, then import it in `js/viewer.js` and add it to `PYRAMIDS`. It loads [three.js](https://threejs.org) 0.160.0 from jsDelivr and fonts from Google Fonts.

## Sources

Measurements: W. M. F. Petrie, *The Pyramids and Temples of Gizeh* (1883); V. Maragioglio & C. Rinaldi, *L'Architettura delle Piramidi Menfite* (1965–67); M. Lehner, *The Complete Pyramids* (1997, 2008); G. Dormion, *La chambre de Chéops* (2004); A. Fakhry, *The Monuments of Sneferu at Dahshur* (1959–61); M. Verner, *The Pyramids* (2001); Morishima et al., *Nature* 552 (2017); Procureur et al., *Nature Communications* 14 (2023). Unas: D. Arnold (2003), R. Stadelmann (1985), J. P. Allen, *The Ancient Egyptian Pyramid Texts* (2005). Dates follow I. Shaw (ed.), *The Oxford History of Ancient Egypt* (2000).

## Photo credits

All photos are from Wikimedia Commons, resized for the web. Their original licences apply; follow the links for full terms.

| File | Photographer | Licence | Source |
|---|---|---|---|
| `photos/khufu-exterior.jpg` | Jorge Láscar | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:The_Great_Pyramid_of_Giza_(14794652632).jpg) |
| `photos/khufu-entrance.jpg` | Boston Public Library, Tupper Scrapbooks | Public domain | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:The_Entrance_to_Great_Pyramid_by_Boston_Public_Library.jpg) |
| `photos/khufu-subterranean.jpg` | John and Edgar Morton | Public domain | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:27_edgar.jpg) |
| `photos/khufu-gallery-2.jpg` | Mike McBey | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Looking_upwards,_along_the_Grand_Gallery,_inside_the_Great_Pyramid_1984_(50535456558).jpg) |
| `photos/khufu-gallery-1.jpg` | Keith Adler | CC BY-SA 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Great_Pyramid_of_Giza_Grand_Gallery.jpg) |
| `photos/khufu-king-1.jpg` | Andrew Currie | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Khufu_Pyramid_-_King%27s_Chamber.jpg) |
| `photos/khufu-king-2.jpg` | Mike McBey | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:At_the_centre_of_the_Great_Pyramid_(47315820161).jpg) |
| `photos/khufu-shaft.jpg` | Vincent Brown | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Great_Pyramid_Air_Shaft_(39752498153).jpg) |
| `photos/khafre-exterior.jpg` | MusikAnimal | CC BY-SA 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pyramid_of_Khafre_Giza_Egypt_in_2015_2.jpg) |
| `photos/khafre-burial.jpg` | Leon Petrosyan | CC BY-SA 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:The_Pyramide_of_Khofru_3.jpg) |
| `photos/khafre-sarcophagus.jpg` | Kelisi | CC BY-SA 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:KhafresSarcophagus.jpg) |
| `photos/khafre-belzoni.jpg` | Inkapigen | CC BY-SA 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Inscription_in_the_pyramid.jpg) |
| `photos/menkaure-exterior.jpg` | Vincent Brown | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pyramid_of_Menkaure_(29197729700).jpg) |
| `photos/menkaure-descending.jpg` | CT Snow | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Menkaure-pyramid_descending_passage.jpg) |
| `photos/menkaure-panelled.jpg` | Jon Bodsworth | Copyrighted free use | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:11_menkaure_Panelled_Chamber.jpg) |
| `photos/menkaure-portcullis.jpg` | Jon Bodsworth | Copyrighted free use | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:13_menkaure_portcullis_room.jpg) |
| `photos/menkaure-burial.jpg` | Jon Bodsworth | Copyrighted free use | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:17_menkaure_burial_chamber.jpg) |
| `photos/menkaure-niches.jpg` | Jon Bodsworth | Copyrighted free use | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:15_menkaure_chamber_with_five_niches.jpg) |
| `photos/red-exterior.jpg` | Darer101 | CC BY 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Red_Pyramid_at_Dahshur.jpg) |
| `photos/red-passage.jpg` | Jorge Láscar | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Inside_the_Red_Pyramid_-_The_61m._long_passage_leading_to_the_master_chamber_(14795442922).jpg) |
| `photos/red-entrance.jpg` | Sturm58 | CC BY-SA 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Red-pyramid_-_entry.jpg) |
| `photos/red-corbel-1.jpg` | Jon Bodsworth | Copyrighted free use | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:11_red_corbel_1.jpg) |
| `photos/red-corbel-2.jpg` | Jon Bodsworth | Copyrighted free use | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:12_red_corbel_2.jpg) |
| `photos/red-chamber.jpg` | Roland Unger | CC BY-SA 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:DahshurRedPyrChamber.jpg) |
| `photos/red-burial.jpg` | Jorge Láscar | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Massive_corbel-vaulted_ceiling_of_the_main_burial_chamber_-_Red_Pyramid_(14772801236).jpg) |
| `photos/bent-exterior.jpg` | Jorge Láscar | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bent_Pyramid_featuring_the_original_polished_limestone_outer_casing_that_the_pyramids_used_to_have_(14616487960).jpg) |
| `photos/bent-bend.jpg` | Darer101 | CC BY-SA 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:11-degree_angle_change_of_the_Bent_Pyramid_at_Dahshur.jpg) |
| `photos/bent-chamber.jpg` | Panegyrics of Granovetter | CC BY-SA 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:26722-_burial_chamber_in_Sneferu%27s_Bent_pyramid.jpg) |
| `photos/unas-burial.jpg` | Vincent Brown | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Burial_chamber_in_Unas%27_pyramid.jpg) |
| `photos/unas-wall.jpg` | Vincent Brown | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Burial_Chamber_Wall_of_Unas%E2%80%99_Pyramid.jpg) |
| `photos/unas-ceiling.jpg` | Vincent Brown | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Unas%E2%80%99_Sarcophagus_Chamber_Ceiling.jpg) |
| `photos/unas-texts.jpg` | Brooklyn Museum lantern slide | Public domain | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Unas_Pyramidentexte.jpg) |
| `photos/unas-exterior.jpg` | Darer101 | CC BY-SA 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pyramid_of_Unas_at_Saqqara.jpg) |
| `photos/pt-247-253.jpg` | Thoth (Wikimedia Commons uploader) | Public domain (PD-Egypt) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pyramid_text_utterance_253_to_247.png) |
| `photos/pt-254-260.jpg` | Thoth (Wikimedia Commons uploader) | Public domain (PD-Egypt) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pyramid_text_utterance_260_to_254.jpg) |
| `photos/pt-260-272.jpg` | Thoth (Wikimedia Commons uploader) | Public domain (PD-Egypt) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pyramid_text_utterance_272_to_260.jpg) |
| `photos/pt-273-276.jpg` | Thoth (Wikimedia Commons uploader) | Public domain (PD-Egypt) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pyramid_text_utterance_276_to_273.png) |
| `photos/pt-277-301.jpg` | Thoth (Wikimedia Commons uploader) | Public domain (PD-Egypt) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pyramid_text_utterance_301_to_277.jpg) |
| `photos/pt-302-312.jpg` | Thoth (Wikimedia Commons uploader) | Public domain (PD-Egypt) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pyramid_text_utterance_302_to_312.jpg) |
| `photos/unas-texts-colour.jpg` | Aidan McRae Thomson | CC BY-SA 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pyramid_Texts_in_Unas%E2%80%99_Pyramid_2017.jpg) |
| `photos/khufu-lepsius.jpg` | Lepsius expedition artist (1842) | Public domain | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lepsius-inschrift-cheops-pyramide.jpeg) |
| `photos/khufu-cartouche-mark.jpg` | Karl Richard Lepsius | Public domain | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Kartu_Chufu01.JPG) |
| `photos/khufu-gang-names.jpg` | George Andrew Reisner | Public domain | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Khufu_work_gang_names.png) |
| `photos/khufu-queen-niche.jpg` | Jon Bodsworth | Copyrighted free use | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Reine-niche.jpg) |
| `photos/bent-entrance.jpg` | Jon Bodsworth | Copyrighted free use | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:02_bent_north_entrance.jpg) |
| `photos/khafre-passage.jpg` | Jon Bodsworth | Copyrighted free use | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:04_khafre_passage.jpg) |
| `photos/djoser-exterior.jpg` | Ondřej Havelka | CC BY-SA 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Step_Pyramid_of_Djoser.jpg) |
| `photos/djoser-corridor.jpg` | Fabio Achili | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Corridor_of_Step_Pyramid_2023a.jpg) |
| `photos/djoser-vault.jpg` | Richard Mortel | CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Sarcophagus_of_Djoser,_Southern_entrance_of_the_Step_Pyramid_of_Djoser_at_Saqqara,_ca._2700_BCE_(1).jpg) |
| `photos/djoser-tiles.jpg` | Metropolitan Museum of Art | CC0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Wall_tiles_from_the_funerary_apartments_of_king_Djoser_MET_DT258569.jpg) |
| `photos/djoser-serdab.jpg` | Jon Bodsworth | Copyrighted free use | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Djoser_Serdap_1.jpg) |
| `photos/sphinx-exterior.jpg` | Petar Milošević | CC BY-SA 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Great_Sphinx_(%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84).jpg) |
| `photos/sphinx-stela.jpg` | HoremWeb | CC BY-SA 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dream-stela.jpg) |
| `photos/tut-north.jpg` | ولاء (Wala) | Public domain | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:KV62,_Egypt_03.jpg) |
| `photos/tut-west.jpg` | Romagy | CC BY-SA 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tutankhamun_KV62_burial_chamber_and_sarcophagus.jpg) |
| `photos/tut-east.jpg` | Romagy | CC BY-SA 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tutankhamun_KV62_burial_chamber_procession.jpg) |
| `photos/seti-corridor.jpg` | Carole Raddato | CC BY-SA 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:KV17,_the_tomb_of_Pharaoh_Seti_I_of_the_Nineteenth_Dynasty,_Corridor_D_decorated_with_the_fourth_hour_of_the_Amduat,_Valley_of_the_Kings,_Egypt_(49846343896).jpg) |
| `photos/seti-hall.jpg` | Carole Raddato | CC BY-SA 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:KV17,_the_tomb_of_Pharaoh_Seti_I_of_the_Nineteenth_Dynasty,_Pillared_Chamber_F,_left_pillar_Seti_before_Hathor_as_Goddess_of_the_West,_right_pillar_Seti_before_Isis,_Valley_of_the_Kings,_Egypt_(49846646197).jpg) |
| `photos/seti-burial.jpg` | Carole Raddato | CC BY-SA 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:KV17,_the_tomb_of_Pharaoh_Seti_I_of_the_Nineteenth_Dynasty,_Burial_chamber_J,_Valley_of_the_Kings,_Egypt_(49846644117).jpg) |
| `photos/seti-ceiling.jpg` | Carole Raddato | CC BY-SA 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:KV17,_the_tomb_of_Pharaoh_Seti_I_of_the_of_the_burial_chamber,_Nineteenth_Dynasty,_astronomical_vaulted_ceiling_Valley_of_the_Kings,_Egypt_(49845803483).jpg) |

## Publishing a change

Run `scripts/stamp.sh` before committing a change to `css/` or `js/`. It stamps `index.html` with a version taken from the code, so browsers load the new scripts and styles together instead of mixing in cached old copies.
