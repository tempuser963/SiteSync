import { useTheme } from '../context/ThemeContext';
import { chartTheme, ChartColorTokens } from './tokens';

export interface ChartThemeConfig {
  colors: ChartColorTokens;
  isDark: boolean;
  gridProps: {
    strokeDasharray: string;
    stroke: string;
    strokeOpacity: number;
  };
  xAxisProps: {
    stroke: string;
    tick: { fill: string; fontSize: number };
    axisLine: { stroke: string };
  };
  yAxisProps: {
    stroke: string;
    tick: { fill: string; fontSize: number };
    axisLine: { stroke: string };
  };
  tooltipProps: {
    contentStyle: React.CSSProperties;
    itemStyle: React.CSSProperties;
    labelStyle: React.CSSProperties;
  };
  legendProps: {
    wrapperStyle: React.CSSProperties;
  };
}

export const useChartTheme = (): ChartThemeConfig => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const colors = chartTheme[resolvedTheme];

  return {
    colors,
    isDark,
    gridProps: {
      strokeDasharray: '3 3',
      stroke: colors.grid,
      strokeOpacity: isDark ? 0.6 : 0.9,
    },
    xAxisProps: {
      stroke: colors.border,
      tick: { fill: colors.mutedText, fontSize: 11 },
      axisLine: { stroke: colors.grid },
    },
    yAxisProps: {
      stroke: colors.border,
      tick: { fill: colors.mutedText, fontSize: 11 },
      axisLine: { stroke: colors.grid },
    },
    tooltipProps: {
      contentStyle: {
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        borderWidth: 1,
        borderRadius: '0.5rem',
        color: colors.tooltipText,
        fontSize: '12px',
        padding: '8px 12px',
        boxShadow: isDark
          ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      },
      itemStyle: {
        color: colors.tooltipText,
        fontSize: '12px',
      },
      labelStyle: {
        color: colors.tooltipText,
        fontWeight: 600,
        marginBottom: '4px',
        fontSize: '12px',
      },
    },
    legendProps: {
      wrapperStyle: {
        color: colors.text,
        fontSize: '11px',
        paddingTop: '8px',
      },
    },
  };
};
