
**GIT**

We follow two trunk branches - main & development
***For Now developement is not there till v1***

Before adding any change make sure to checkout a branch from development
```
git checkout -b feat/description, fix/description, hotfix/description
```

Before raising a ***Pull Request***, pull changes from development

**Code**

- Add file description at the top of file
- We intend to keep files under 1000 lines
- Any base component should be named as ***BaseComponent*** [Ex - BaseButton, BaseChip]
- Imports should be relative ex - @/Components/compo

**General**

- Keep adding commands for specific installs/setups in readme
- Keep adding readme instructions in readme file whenever are required
- Keep libraries info in libraries.md updated
- Once a functionality's circle is completed, add tests related to them



