# Grade Predictor Web App

A static web application that predicts your final grade based on your current coursework scores across different subjects (MLT, BDM, MAD2).

## Features

- **Subject Selection**: Choose from MLT, BDM, or MAD2
- **Dynamic Input Fields**: Input fields adjust based on selected subject
- **Real-time Calculation**: Calculate minimum scores needed for each grade
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **No Backend Required**: Fully static - can be hosted anywhere

## How to Use

1. Select your subject from the dropdown
2. Enter your scores:
   - **GAA/GA**: Your current average
   - **Qz1/Qz2**: Your quiz scores
   - **Bonus**: Additional bonus points (MLT and MAD2 only)
3. Click "Calculate" to see the results
4. View the table showing the minimum F (final exam score) needed for each grade

## Grading Scale

- **S**: 90+
- **A**: 80-89
- **B**: 70-79
- **C**: 60-69
- **D**: 50-59
- **E**: 40-49
- Below 40: Fail

## Deployment to GitHub Pages

### Method 1: Using GitHub Pages with main branch

1. Create a GitHub repository (if not already created)
2. Push all files to the `main` branch:
   ```bash
   git add .
   git commit -m "Add Grade Predictor web app"
   git push origin main
   ```
3. Go to your repository settings → Pages
4. Under "Source", select `main` branch and `/root` folder (or just `/` for root)
5. Your site will be available at: `https://yourusername.github.io/GradePredictor`

### Method 2: Using GitHub Pages with docs folder

1. Move the `src` folder contents to a `docs` folder:
   ```bash
   mkdir docs
   move src\*.* docs\
   ```
2. Push to GitHub
3. Go to repository settings → Pages
4. Select `main` branch and `/docs` folder
5. Your site will be available at: `https://yourusername.github.io/GradePredictor`

### Method 3: Rename src to match your preference

If you want the web app to be served from the root, rename `src` to the appropriate folder based on your setup.

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and responsive design
- `script.js` - Application logic (ported from Python)

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Local Development

Simply open `index.html` in your browser. No build process or dependencies required!

## Formula Reference

### MLT & MAD2:
```
T = min(0.05*GAA + max(0.6*F + 0.25*max(Qz1,Qz2), 0.4*F + 0.25*Qz1 + 0.3*Qz2) + Bonus, 100)
```

### BDM:
```
T = 0.1*GA + 0.2*Qz1 + 0.2*Qz2 + 0.5*F
```

Where:
- `T` = Final grade
- `F` = Final exam score (what we calculate)
- `GAA/GA` = Assignment/Grade average
- `Qz1/Qz2` = Quiz scores
- `Bonus` = Bonus points (MLT & MAD2 only)
