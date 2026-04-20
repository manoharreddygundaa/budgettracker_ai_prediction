package com.fullStack.expenseTracker.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ForumPostRequest {
    private String title;
    private String content;
}
