# Barre de progression de lecture – WorldOfGeek

## Objectif
Ajouter une **barre de progression de lecture** ultra discrète afin d’augmenter le **scroll depth**, le **temps actif** et la **complétion d’article** sur mobile (Discover-first).

Aucun impact négatif sur les Core Web Vitals.

---

## Périmètre
- Pages concernées : **articles (single post) uniquement**
- Priorité : **mobile**
- Desktop : optionnel (peut être désactivé)

---

## Comportement attendu
- La barre se **remplit progressivement** en fonction du scroll dans l’article
- Elle **n’apparaît pas au chargement**
- Elle apparaît après **5–10 % de scroll**
- Elle disparaît automatiquement à **100 %**

---

## Contraintes UX
- Hauteur maximale : **2 px**
- Position : **fixed bottom**
- Aucun texte
- Aucune interaction
- Aucune animation “fantaisie”

La barre doit être **quasi invisible consciemment**, mais perceptible visuellement.

---

## Contraintes techniques
- Aucun impact CLS (ne doit pas modifier le layout)
- JS minimal (scroll ou IntersectionObserver)
- CSS simple
- Compatible mobile
- Respect de `prefers-reduced-motion`
- Chargement uniquement sur les pages articles

---

## Style
- Couleur : couleur principale de la charte WorldOfGeek
- Fond : transparent ou noir très léger
- Pas d’ombre
- Pas de glow

---

## Calcul de progression
- Basé sur la hauteur réelle du contenu de l’article
- Ne pas inclure le header, footer ou la sidebar
- Progression linéaire (0 → 100 %)

---

## Conditions de désactivation
- Si JavaScript est désactivé
- Si `prefers-reduced-motion: reduce` est actif

---

## Bonnes pratiques attendues
- Code lisible
- Pas de dépendance externe
- Facilement désactivable
- Aucun tracking supplémentaire

---

## Résultat attendu
- Amélioration du scroll depth
- Augmentation du temps actif
- Aucun effet visible négatif sur l’expérience utilisateur
