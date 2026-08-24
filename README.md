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
