"""
Iris Dataset - In-Depth Exploratory Data Analysis
A Streamlit application for exploring the classic Iris flower dataset.
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.figure_factory as ff
import plotly.graph_objects as go
from scipy import stats
from pathlib import Path

# --------------------------------------------------------------------------
# Page config
# --------------------------------------------------------------------------
st.set_page_config(
    page_title="Iris EDA",
    page_icon="🌸",
    layout="wide",
    initial_sidebar_state="expanded",
)

DATA_PATH = Path(__file__).parent / "data" / "iris.csv"
FEATURES = ["sepal_length", "sepal_width", "petal_length", "petal_width"]
SPECIES_COLORS = {
    "setosa": "#6C5CE7",
    "versicolor": "#00B894",
    "virginica": "#E17055",
}


@st.cache_data
def load_data() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH)
    return df


df = load_data()

# --------------------------------------------------------------------------
# Sidebar - filters
# --------------------------------------------------------------------------
st.sidebar.title("🌸 Iris EDA")
st.sidebar.markdown("Filter the dataset to explore subsets interactively.")

species_options = sorted(df["species"].unique())
selected_species = st.sidebar.multiselect(
    "Species", options=species_options, default=species_options
)

feature_ranges = {}
st.sidebar.markdown("---")
st.sidebar.subheader("Feature ranges")
for feat in FEATURES:
    lo, hi = float(df[feat].min()), float(df[feat].max())
    feature_ranges[feat] = st.sidebar.slider(
        feat.replace("_", " ").title(), lo, hi, (lo, hi), step=0.1
    )

mask = df["species"].isin(selected_species)
for feat, (lo, hi) in feature_ranges.items():
    mask &= df[feat].between(lo, hi)
fdf = df[mask].copy()

st.sidebar.markdown("---")
st.sidebar.caption(f"Showing **{len(fdf)}** of **{len(df)}** rows")
st.sidebar.download_button(
    "Download filtered CSV",
    data=fdf.to_csv(index=False),
    file_name="iris_filtered.csv",
    mime="text/csv",
)

# --------------------------------------------------------------------------
# Header
# --------------------------------------------------------------------------
st.title("🌸 Iris Dataset: In-Depth Exploratory Data Analysis")
st.markdown(
    """
The **Iris dataset** (Fisher, 1936) contains 150 measurements of iris flowers
across three species — *setosa*, *versicolor*, and *virginica* — with four
features: sepal length, sepal width, petal length, and petal width (all in cm).
Use the sidebar to filter by species or feature range; every section below
updates live.
"""
)

if fdf.empty:
    st.warning("No rows match the current filters. Adjust the sidebar controls.")
    st.stop()

# --------------------------------------------------------------------------
# Tabs
# --------------------------------------------------------------------------
tab_overview, tab_univariate, tab_bivariate, tab_multivariate, tab_stats, tab_raw = st.tabs(
    [
        "📋 Overview",
        "📊 Univariate",
        "🔗 Bivariate",
        "🧭 Multivariate",
        "🧪 Statistical Tests",
        "🗂️ Raw Data",
    ]
)

# ==========================================================================
# TAB: Overview
# ==========================================================================
with tab_overview:
    st.subheader("Dataset snapshot")

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Rows (filtered)", len(fdf))
    c2.metric("Species present", fdf["species"].nunique())
    c3.metric("Features", len(FEATURES))
    c4.metric("Missing values", int(fdf.isna().sum().sum()))

    st.markdown("#### Class balance")
    counts = fdf["species"].value_counts().reindex(species_options).fillna(0)
    fig = px.bar(
        counts,
        x=counts.index,
        y=counts.values,
        color=counts.index,
        color_discrete_map=SPECIES_COLORS,
        labels={"x": "species", "y": "count"},
        text=counts.values,
    )
    fig.update_layout(showlegend=False, height=350)
    st.plotly_chart(fig, use_container_width=True)

    st.markdown("#### Descriptive statistics")
    st.dataframe(fdf[FEATURES].describe().T.style.format("{:.3f}"), use_container_width=True)

    st.markdown("#### Descriptive statistics by species")
    grouped = fdf.groupby("species")[FEATURES].agg(["mean", "std", "min", "max"])
    st.dataframe(grouped.style.format("{:.3f}"), use_container_width=True)

    st.markdown("#### Data types & non-null counts")
    info_df = pd.DataFrame(
        {
            "dtype": fdf.dtypes.astype(str),
            "non_null": fdf.notna().sum(),
            "n_unique": fdf.nunique(),
        }
    )
    st.dataframe(info_df, use_container_width=True)

# ==========================================================================
# TAB: Univariate
# ==========================================================================
with tab_univariate:
    st.subheader("Distribution of a single feature")

    feat = st.selectbox("Choose a feature", FEATURES, key="uni_feat")
    plot_type = st.radio(
        "Plot type", ["Histogram", "Box plot", "Violin plot", "KDE (density)"],
        horizontal=True,
    )
    split_by_species = st.checkbox("Split by species", value=True)

    color_arg = "species" if split_by_species else None
    color_map = SPECIES_COLORS if split_by_species else None

    if plot_type == "Histogram":
        fig = px.histogram(
            fdf, x=feat, color=color_arg, color_discrete_map=color_map,
            marginal="rug", nbins=25, barmode="overlay", opacity=0.7,
        )
    elif plot_type == "Box plot":
        fig = px.box(
            fdf, y=feat, x="species" if split_by_species else None,
            color=color_arg, color_discrete_map=color_map, points="all",
        )
    elif plot_type == "Violin plot":
        fig = px.violin(
            fdf, y=feat, x="species" if split_by_species else None,
            color=color_arg, color_discrete_map=color_map, box=True, points="all",
        )
    else:  # KDE
        groups = [fdf["species"]] if split_by_species else [pd.Series(["all"] * len(fdf))]
        if split_by_species:
            hist_data = [fdf.loc[fdf["species"] == s, feat].values for s in species_options if s in fdf["species"].unique()]
            labels = [s for s in species_options if s in fdf["species"].unique()]
            colors = [SPECIES_COLORS[s] for s in labels]
            fig = ff.create_distplot(hist_data, labels, show_hist=False, colors=colors)
        else:
            fig = ff.create_distplot([fdf[feat].values], [feat], show_hist=False)

    fig.update_layout(height=450)
    st.plotly_chart(fig, use_container_width=True)

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Mean", f"{fdf[feat].mean():.3f}")
    c2.metric("Median", f"{fdf[feat].median():.3f}")
    c3.metric("Std dev", f"{fdf[feat].std():.3f}")
    c4.metric("Skewness", f"{fdf[feat].skew():.3f}")

    st.markdown("#### All features at a glance")
    fig_all = go.Figure()
    for f in FEATURES:
        fig_all.add_trace(go.Box(y=fdf[f], name=f))
    fig_all.update_layout(height=400, title="Box plots for all features")
    st.plotly_chart(fig_all, use_container_width=True)

# ==========================================================================
# TAB: Bivariate
# ==========================================================================
with tab_bivariate:
    st.subheader("Relationship between two features")

    c1, c2 = st.columns(2)
    x_feat = c1.selectbox("X-axis feature", FEATURES, index=2, key="biv_x")
    y_feat = c2.selectbox("Y-axis feature", FEATURES, index=3, key="biv_y")

    fig = px.scatter(
        fdf, x=x_feat, y=y_feat, color="species", color_discrete_map=SPECIES_COLORS,
        trendline="ols", marginal_x="box", marginal_y="box",
        hover_data=FEATURES, opacity=0.8,
    )
    fig.update_layout(height=550)
    st.plotly_chart(fig, use_container_width=True)

    corr_val = fdf[x_feat].corr(fdf[y_feat])
    st.metric(f"Pearson correlation ({x_feat} vs {y_feat})", f"{corr_val:.3f}")

    st.markdown("#### Correlation heatmap")
    corr_method = st.radio("Method", ["pearson", "spearman", "kendall"], horizontal=True)
    corr_matrix = fdf[FEATURES].corr(method=corr_method)
    fig_corr = px.imshow(
        corr_matrix, text_auto=".2f", color_continuous_scale="RdBu_r",
        zmin=-1, zmax=1, aspect="auto",
    )
    fig_corr.update_layout(height=450)
    st.plotly_chart(fig_corr, use_container_width=True)

# ==========================================================================
# TAB: Multivariate
# ==========================================================================
with tab_multivariate:
    st.subheader("Multi-feature exploration")

    st.markdown("#### Scatter matrix (pair plot)")
    fig_matrix = px.scatter_matrix(
        fdf, dimensions=FEATURES, color="species", color_discrete_map=SPECIES_COLORS,
        opacity=0.7,
    )
    fig_matrix.update_layout(height=800)
    fig_matrix.update_traces(diagonal_visible=False, showupperhalf=True)
    st.plotly_chart(fig_matrix, use_container_width=True)

    st.markdown("#### Parallel coordinates")
    pc_df = fdf.copy()
    species_code = {s: i for i, s in enumerate(species_options)}
    pc_df["species_code"] = pc_df["species"].map(species_code)
    fig_pc = px.parallel_coordinates(
        pc_df, dimensions=FEATURES, color="species_code",
        color_continuous_scale=px.colors.diverging.Portland,
        labels={f: f.replace("_", " ") for f in FEATURES},
    )
    fig_pc.update_layout(height=450)
    st.plotly_chart(fig_pc, use_container_width=True)

    st.markdown("#### 3D scatter")
    c1, c2, c3 = st.columns(3)
    x3 = c1.selectbox("X", FEATURES, index=0, key="x3")
    y3 = c2.selectbox("Y", FEATURES, index=1, key="y3")
    z3 = c3.selectbox("Z", FEATURES, index=2, key="z3")
    fig_3d = px.scatter_3d(
        fdf, x=x3, y=y3, z=z3, color="species", color_discrete_map=SPECIES_COLORS,
        opacity=0.8,
    )
    fig_3d.update_layout(height=600)
    st.plotly_chart(fig_3d, use_container_width=True)

# ==========================================================================
# TAB: Statistical Tests
# ==========================================================================
with tab_stats:
    st.subheader("Statistical hypothesis tests")

    st.markdown(
        "#### One-way ANOVA: does the feature mean differ across species?"
    )
    present_species = [s for s in species_options if s in fdf["species"].unique()]
    if len(present_species) >= 2:
        rows = []
        for feat in FEATURES:
            groups = [fdf.loc[fdf["species"] == s, feat].values for s in present_species]
            groups = [g for g in groups if len(g) > 1]
            if len(groups) >= 2:
                f_stat, p_val = stats.f_oneway(*groups)
                rows.append({"feature": feat, "F-statistic": f_stat, "p-value": p_val,
                             "significant (α=0.05)": "Yes" if p_val < 0.05 else "No"})
        anova_df = pd.DataFrame(rows).set_index("feature")
        st.dataframe(
            anova_df.style.format({"F-statistic": "{:.3f}", "p-value": "{:.2e}"}),
            use_container_width=True,
        )
        st.caption(
            "A low p-value (< 0.05) indicates the feature's mean differs "
            "significantly across the selected species."
        )
    else:
        st.info("Select at least two species in the sidebar to run ANOVA.")

    st.markdown("---")
    st.markdown("#### Shapiro–Wilk normality test (per species, per feature)")
    rows = []
    for s in present_species:
        for feat in FEATURES:
            vals = fdf.loc[fdf["species"] == s, feat].values
            if len(vals) >= 3:
                stat_, p_val = stats.shapiro(vals)
                rows.append({
                    "species": s, "feature": feat, "W-statistic": stat_,
                    "p-value": p_val,
                    "normal (α=0.05)": "Yes" if p_val > 0.05 else "No",
                })
    if rows:
        norm_df = pd.DataFrame(rows)
        st.dataframe(
            norm_df.style.format({"W-statistic": "{:.3f}", "p-value": "{:.3f}"}),
            use_container_width=True,
        )
    else:
        st.info("Not enough samples per species to test normality (need ≥ 3).")

    st.markdown("---")
    st.markdown("#### Pairwise correlation significance (Pearson)")
    rows = []
    for i, f1 in enumerate(FEATURES):
        for f2 in FEATURES[i + 1:]:
            r, p_val = stats.pearsonr(fdf[f1], fdf[f2])
            rows.append({"pair": f"{f1} vs {f2}", "r": r, "p-value": p_val,
                         "significant (α=0.05)": "Yes" if p_val < 0.05 else "No"})
    pair_df = pd.DataFrame(rows).set_index("pair")
    st.dataframe(
        pair_df.style.format({"r": "{:.3f}", "p-value": "{:.2e}"}),
        use_container_width=True,
    )

# ==========================================================================
# TAB: Raw Data
# ==========================================================================
with tab_raw:
    st.subheader("Filtered raw data")
    st.dataframe(fdf, use_container_width=True, height=500)
    st.caption(f"{len(fdf)} rows × {fdf.shape[1]} columns")

    st.markdown("#### Duplicate rows")
    dup_count = fdf.duplicated().sum()
    st.write(f"Number of duplicate rows: **{dup_count}**")
    if dup_count > 0:
        st.dataframe(fdf[fdf.duplicated(keep=False)], use_container_width=True)

st.markdown("---")
st.caption(
    "Data source: `sklearn.datasets.load_iris` (UCI Iris dataset, Fisher 1936). "
    "Built with Streamlit, Plotly, and SciPy."
)
