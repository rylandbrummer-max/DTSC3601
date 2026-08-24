# Iris EDA

A Streamlit app for interactive exploratory data analysis of the classic Iris flower dataset (Fisher, 1936).

## Features

- **Sidebar filters** — filter by species and by feature value ranges, with a button to download the filtered data as CSV.
- **Overview** — dataset snapshot, class balance, descriptive statistics, and data types.
- **Univariate** — histograms, box plots, violin plots, and KDE plots for a single feature, split by species.
- **Bivariate** — scatter plots with trendlines, Pearson/Spearman/Kendall correlation heatmaps.
- **Multivariate** — scatter matrix, parallel coordinates, and 3D scatter plots.
- **Statistical tests** — one-way ANOVA, Shapiro–Wilk normality tests, and pairwise correlation significance.
- **Raw data** — filtered table view with duplicate row detection.

## Setup




```bash
pip install -r requirements.txt
```

## Run

```bash
streamlit run app.py
```

## Data

`data/iris.csv` — 150 measurements (sepal length/width, petal length/width) across three species: *setosa*, *versicolor*, *virginica*.

<img width="1920" height="1200" alt="Screenshot From 2026-08-23 23-29-25" src="https://github.com/user-attachments/assets/f341c833-2eb0-44e4-a5f9-ec5d81faa083" />
<img width="1920" height="1200" alt="Screenshot From 2026-08-23 23-29-17" src="https://github.com/user-attachments/assets/4dde6325-181b-4302-92a6-61e091e95206" />
