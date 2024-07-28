import pandas as pd

input_file = 'data/test_clean_out.csv'

df = pd.read_csv(input_file)
age_column = 'age'


valid_ages = df[df[age_column] != -1][age_column]
valid_ages = df[(df[age_column] != -1) & (df[age_column] >= 6) & (df[age_column] <= 150)][age_column]

print(df[df[age_column] == 98]["cleaned_hm"])