#don't run this again unless needed to, it already output the csv that I'm using.
import pandas as pd

# load datasets:
scope1 = pd.read_csv("data/Scope1.csv")
scope2 = pd.read_csv("data/Scope2.csv")
faculty = pd.read_csv("data/Scope3/FacultyCommuting.csv")
staff = pd.read_csv("data/Scope3/StaffCommuting.csv")
air = pd.read_csv("data/Scope3/OutsourcedTravel.csv")

#process scopes 1 & 2
scope1["Scope 1"] = scope1.drop(columns=["Fiscal Year"]).sum(axis=1)
scope1 = scope1[["Fiscal Year", "Scope 1"]]
scope2 = scope2.rename(columns={"Electricity": "Scope 2"})

#sum values
faculty["Faculty Total"] = faculty.drop(columns=["Fiscal Year"]).sum(axis=1)
staff["Staff Total"] = staff.drop(columns=["Fiscal Year"]).sum(axis=1)

#merge to get total for scope 3
scope3 = pd.merge(faculty[["Fiscal Year", "Faculty Total"]],
                  staff[["Fiscal Year", "Staff Total"]],
                  on="Fiscal Year", how="outer")
scope3 = pd.merge(scope3, air, on="Fiscal Year", how="outer")
scope3 = scope3.fillna(0)
#export scope 3 to be used later
scope3.to_csv("data/Scope3.csv", index=False)
scope3["Scope 3"] = scope3["Faculty Total"] + scope3["Staff Total"] + scope3["Air"]
scope3 = scope3[["Fiscal Year", "Scope 3"]]

#create final data frame
final = scope1.merge(scope2, on="Fiscal Year", how="outer")
final = final.merge(scope3, on="Fiscal Year", how="outer")

final = final.fillna(0).sort_values("Fiscal Year")

#check to make sure it looks right
print(final)
#scope 1 is stored as a double for some reason but other than that looks good
final.to_csv("data/total.csv", index=False)
