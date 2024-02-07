function fix_pivot(matrix, y) {
    let M = matrix.length;
    let best_fit = y;
    
    for (let y_ = y + 1; y_ < M; y_++) {
        if (matrix[y_][y] != 0) {
            if ((matrix[y_][y] > matrix[best_fit][y]) || (best_fit == y)) {
                best_fit = y_;
            }
        }
    }
    
    [matrix[best_fit], matrix[y]] = [matrix[y], matrix[best_fit]];
}
    
function convert_to_pivot_row(matrix, y) {
    let pivot = matrix[y][y];
    matrix[y] = matrix[y].map(x => x / pivot);
}

function convert_to_operated_row(matrix, y_, y) {
    let row = matrix[y];
    let pivot_parallel = matrix[y_][y];

    for (let i = 0; i < row.length; i++) {
        matrix[y_][i] -= row[i] * pivot_parallel;
    }
}

function solve_linear_equation(matrix) {
    let M = matrix.length;

    for (let y = 0; y < M; y++) {
        let pivot = matrix[y][y];
        
        if (pivot == 0) {
            fix_pivot(matrix, y);
            pivot = matrix[y][y];
            
            if (!pivot) {
                continue;
            }
        }

        convert_to_pivot_row(matrix, y);

        for (let y_ = y + 1; y_ < M; y_++) {
            convert_to_operated_row(matrix, y_, y);
        }
    }

    for (let y = 0; y < M; y++) {
        for (let y_ = 0; y_ < y; y_++) {
            convert_to_operated_row(matrix, y_, y);
        }
    }

    for (let ri = 0; ri < matrix.length; ri++) {
        let row = matrix[ri];

        if (row[ri] == 0) {
            return row[row.length - 1] == 0 ? -2 : -1;
        }
    }

    let result = matrix.map(row => row[row.length - 1]);
    return result;
}

function generateEquationRowTemplate(variable_count) {
    let template = `<input class="value-1" type="number" value="0"><span>x1</span>`;

    for (let i = 2; i <= variable_count; i++) {
        template += `<span>+</span><input class="value-${i}" type="number" value="0"><span>x${i}</span>`;
    }

    template += `<span>=</span><input class="value" type="number" value="0">`;

    return template;
}

function generateEquationsTemplate(variable_count) {
    let template = "";

    for (let i = 1; i <= variable_count; i++) {
        template += `<div id="equation-${i}" class="equation-row">${generateEquationRowTemplate(variable_count)}</div>`;
    }

    return template;
}

function getEquations() {
    let variable_count = parseInt(document.getElementById("variable-count").value);
    let equation_matrix = [];

    for (let i = 1; i <= variable_count; i++) {
        let row = [];
        let row_element = document.getElementById(`equation-${i}`);
        let value;

        for (let j = 1; j <= variable_count; j++) {
            value = row_element.querySelector(`.value-${j}`).value;
            value = parseFloat(value);

            row.push(value);
        }

        value = row_element.querySelector(".value").value;
        value = parseFloat(value);
        
        row.push(value);
        equation_matrix.push(row);
    }
    
    return equation_matrix;
}

function solveEquations() {
    let equation_matrix = getEquations();
    let result = solve_linear_equation(equation_matrix);

    let result_element = document.getElementById("solutions");
    let result_template = "";
    
    if (result == -2) {
        result_template = "Infinite solutions";
    } else if (result == -1) {
        result_template = "No solutions (Inconsistent System)";
    } else {
        for (let i = 0; i < result.length; i++) {
            result_template += `
                <div class="solution-row">
                    <span class="variable">x${i + 1}</span> = <span class="value">${result[i]}</span>
                </div>
            `;
        }
    }

    result_element.innerHTML = result_template;
}

