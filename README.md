
# Meridia - A Modern Python IDE

Meridia is a high-performance IDE built specifically for Python development. Designed to streamline the coding experience, it brings advanced features, optimized speed, and a clean, intuitive user interface. Developed in TypeScript, Meridia aims to make Python development feel effortless.

Key Features:
- **Optimized Python Development**: Fast, seamless coding experience with intelligent tools and speed optimization.
- **One-click Deployment**: Simplified deployment for faster execution of Python projects.
- **Inbuilt Terminal**: Integrated terminal for executing commands directly within the IDE.
- **Data-centric Workflow**: Includes tools to manage, visualize, and analyze data easily within the IDE.

## Features

### **Meridia Studio**
- **Data Management**: Easily add Excel or CSV files and store them within Meridia's memory. You can name the data, for example, `Superstore`, and use it directly in your Python code.
- **Data Conversion**: When you use a stored data name, Meridia automatically converts it to a Pandas DataFrame, making data handling a breeze.
- **Data Visualization**: Visualize data through charts, tables, and other tools directly in Meridia Studio.
- **Drag-and-Drop**: Simply drag saved variables from the Meridia Studio and drop them into your code editor, and Meridia will auto-convert it to Python code for you.
- **Integrated Tools**: Access built-in tools for manipulating or visualizing data stored in Meridia memory.

### **Before and After Example:**

**Before:**

```python
Superstore  # Name of the variable (data)
```

**After:**

```python
import pandas as pd
Superstore_df = pd.read_excel("/path_to_excel_file.xls/.xlsx", options_provided_by_user)
```

Meridia transforms the variable `Superstore` into a Pandas DataFrame, making your data handling workflow easier and faster.

## Run Locally

To get started with Meridia locally, follow these steps:

### 1. Clone the Project
Clone the repository to your local machine:

```bash
git clone https://github.com/Ridit-ManojKhandelwal/Meridia.git
```

### 2. Navigate to Project Directory
Move into the project directory:

```bash
cd Meridia
```

### 3. Install Dependencies
Run the following command to install all the required dependencies:

```bash
yarn install
```

### 4. Rebuild Dependencies (Needed)*
Rebuild any dependencies (necessary)*:

```bash
yarn rebuild
```

### 5. Start Meridia
Launch the Meridia IDE:

```bash
yarn start
```

## Vision for Meridia

Meridia is designed to improve data handling within the Python ecosystem. While there are existing IDEs like VSCode and PyCharm, Meridia’s unique approach focuses on **data-centric development**.

Instead of managing datasets externally, Meridia makes it possible to directly interact with datasets within the IDE, turning them into easily accessible objects that can be used directly in your code, significantly improving productivity.

---

## Modding & Customization

Currently, Meridia does not support extensions or mods. However, modding functionality will be available in **Meridia 2.0**, allowing for greater flexibility and customization. In the meantime, you can still modify the source code to meet your needs.

---

## Contributing

We welcome contributions! If you would like to contribute to Meridia, check out our `contributing.md` file for guidelines.

When submitting a pull request:
- Use descriptive titles, such as `Add feature X` or `Fix bug Y`.
- Make sure to write clear and concise commit messages.
- Ensure your changes are well-tested.

> **Note**: Submitting a pull request does not guarantee it will be merged. We encourage you to ensure your contribution is robust and well-tested before submitting.

---

## Reporting Issues

If you encounter an issue or have an idea for a new feature, feel free to report it via the [Issues Page](https://github.com/Ridit-ManojKhandelwal/Meridia/issues). We strive to respond to all issues within 24 hours.

---

### Quick Links:
- [Issues Page](https://github.com/Ridit-ManojKhandelwal/Meridia/issues)
- [Contribution Guidelines](contributing.md)
