'use client'

import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

export default function ResultsPage() {

    const mockFeedback = {
        "problemUnderstanding": "# Feedback for the Candidate's Understanding of the Problem\n\n## Strengths\n1. **Basic Understanding:** The candidate demonstrated a basic understanding of how the transformation process works, describing the operations that change the string and how the new characters are generated.\n2. **Character Generation Logic:** They highlighted the idea of moving to the next character in the English alphabet, and understood the process of appending the new characters to the existing string.\n3. **Recognition of Doubling:** The candidate recognized that each operation approximately doubles the length of the string, which is a critical observation in analyzing the growth of the string.\n\n## Areas for Improvement\n1. **Character Index Tracking:** The candidate did not sufficiently elaborate on how to track the position of a character after multiple operations. While they mentioned the character at position 'k' might correspond to 'a' plus an offset, they didn't express how to navigate through the transformations structurally.\n2. **Inaccurate Conclusion About Wrapping:** The candidate's conclusion implied a simple linear calculation for the `k`-th character without addressing the complexity of how the string evolves. More explanation on how the wrapping from 'z' to 'a' could translate across the dimensions of the growing string would be useful.\n3. **Missing Edge Cases:** They did not identify any edge cases where `k` is at the boundary of string lengths or mention what happens as `k` increases to larger numbers or addresses characters beyond the initial few transformations.\n\n## Suggestions for Next Time\n1. **Break Down Transformations:** When explaining the problem, consider breaking down the transformations in detail so you can trace through several iterations and visualize how the string evolves. An illustrative diagram or simulation of the string formation could be helpful.\n2. **Clarify Positioning Logic:** Focus more on how indices change as the string grows. For example, it would be beneficial to establish how to calculate which part of the transformed string the `k`-th character belongs to as the word expands.\n3. **Explore Edge Cases and Complexity:** Take time to discuss potential edge cases, especially with respect to the value of `k` being close to powers of two and how the doubling impacts the character at that index. Also, explore runtime complexity in a broader context if asked to optimize beyond a brute force approach. \n\nBy improving on these areas, the candidate would provide a more comprehensive understanding of the problem and its underlying complexities.",
        "solutionExplanation": "# Candidate Evaluation\n\n## Strengths\n- **Clarity & Structure:** The candidate presented their explanation in a logical sequence, starting with the problem statement and clearly outlining their approach. The distinction between the 0-indexed conversion and the evolution of the string through recursive calls was particularly effective in providing an understanding of the flow of the solution.\n  \n- **Understanding of the Problem:** They demonstrated a strong grasp of the problem's mechanics and the operations involved. The explanation of how the recursive function `findCharRecursive` works to trace back through the operations effectively showcased their analytical thinking.\n\n- **Handling of Edge Cases:** The candidate mentioned the 'z' to 'a' wrap-around as a notable aspect of the solution, indicating they are conscious of character limits in the alphabet and how their approach accommodates this.\n\n## Areas for Improvement\n- **Complexity Analysis:** While the candidate stated that the time complexity is O(k), they could clarify that this is due to the depth of recursive calls rather than the while loop itself. Acknowledging that the while loop to find `powerOfTwo` executes in logarithmic steps would enhance the understanding of the complexities involved. A more accurate evaluation should detail that the overall complexity in the worst case is O(log(k)) due to recursive depth. \n\n- **Space Complexity Discussion:** The candidate mentioned the space complexity as O(1) but did not discuss the implications of recursive calls on the call stack. Since the maximum depth of recursion could be logarithmic, it would be beneficial to state that the space complexity could be considered O(log(k)) in terms of stack space utilized, which is a common aspect to cover in such analyses.\n\n- **Depth of Explanation:** The explanation could have benefited from a bit more elaboration on how the recursive function determines which blocks are 'visited' in the string, specifically the transitions between the first and second halves, as well as the implications of moving to the next character due to the \"next character\" operation.\n\n## Suggestions for Next Time\n- **Enhance Complexity Discussions:** Make sure to differentiate between factors contributing to time and space complexity clearly. Consider stating the rationale behind each complexity factor, especially for recursive algorithms since their nature can often lead to overlooked space issues.\n\n- **More Visual Aids:** When explaining recursive strategies, sometimes it helps to visualize or sketch out how the different iterations relate to one another. This can help clarify points about how indices shift and how string growth occurs over iterations. \n\n- **Conclude with",
        "codeCritique": "# Code Review of the Solution for Alice and Bob Game\n\n## Strengths\n1. **Conceptual Correctness**: The recursive approach to determine the k-th character is fundamentally sound. It accurately handles the partitions in the string generated during iterations based on the problem's requirements.\n  \n2. **Efficiency**: The method utilizes logarithmic properties of string growth, leading to a manageable number of recursive iterations even for larger values of `k`. The use of binary division to find where the index falls within the expanding blocks of characters is efficient.\n\n3. **Commenting**: The code is well-commented, allowing others to understand the purpose of each section, especially the recursive function, which might be complex for some readers.\n\n## Areas for Improvement\n1. **Complexity Analysis**: While the solution is efficient, the time complexity could be better articulated. The method effectively performs a logarithmic search in terms of recursion depth, leading to O(log(k)) time complexity. Nonetheless, the explanation can be improved regarding space complexity, which can climb depending on the depth of recursion (O(log(k))). Transitioning to an iterative approach could prevent potential stack overflow issues for larger `k`.\n\n2. **Variable Naming**: The variable `powerOfTwo` describes its purpose well, but `currentK` could be renamed to something like `zeroIndexedK` for clarity, emphasizing that it's k adjusted to 0-indexing.\n\n3. **Integer Division**: The use of `/` for division in JavaScript can lead to unintended float values, which might be a minor clarification. Using `Math.floor()` could be more explicit about the intent to perform integer division when halving the `powerOfTwo`.\n\n4. **Edge Case Handling**: Although the problem constraints (1 ≤ k ≤ 500) make it less likely to encounter edge cases, it could be prudent to at least acknowledge the smallest value of 1 and its straightforward processing path (where the answer is always 'a').\n\n## Specific Code Suggestions\n1. **Refactor the base case check**: The `findCharRecursive` function currently assumes the index will always reach `0` before finishing. Though mathematically sound due to the nature of the problem, adding a comment or explicit considerations for bounds could prevent confusion for future maintainers.\n\n2. **Consider converting to an iterative approach**: Although recursion is elegant, it can lead to stack overflows. An iterative loop could perform the same calculations with a reduced"
    };
    // const [feedback, setFeedback] = useState<any>(null);
    const [feedback, setFeedback] = useState(mockFeedback);

    useEffect(() => {
        /* 
        const storedFeedback = localStorage.getItem("interviewFeedback");
        if (storedFeedback) {
            setFeedback(JSON.parse(storedFeedback));
            localStorage.removeItem("interviewFeedback");
        }
        */
        console.log("here is your feedback: ",feedback)
    },[feedback])

    if (!feedback) {
        return <div className="text-center text-gray-500">Loading feedback or no feedback found...</div>;
    }

    return (
        <div className="p-8 text-gray-100 bg-gray-950 h-screen overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6">Interview Feedback Report</h1>

            <section className="markdown-section mb-8 p-6 rounded-lg">
                <div className="markdown-content">
                    <Markdown>{feedback.problemUnderstanding}</Markdown>
                </div>
            </section>

            <section className="markdown-section mb-8 p-6 rounded-lg">
                <div className="markdown-content">
                    <Markdown>{feedback.solutionExplanation}</Markdown>
                </div>
            </section>

            <section className="markdown-section mb-8 p-6 rounded-lg">
                <div className="markdown-content">
                    <Markdown>{feedback.codeCritique}</Markdown>
                </div>
            </section>
        </div>
    );
}