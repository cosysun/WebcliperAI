package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	openai "github.com/sashabaranov/go-openai"
)

func main() {
	r := gin.Default()
	r.POST("/openai/summary", Summary)
	r.Run()
}

type SummaryReq struct {
	Content string `json:"content"`
}

type SummaryRsp struct {
	Content string `json:"content"`
}

func Summary(c *gin.Context) {
	var req SummaryReq
	if err := c.BindJSON(&req); err != nil {
		return
	}
	client := openai.NewClient("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")
	rsp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: req.Content,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}
	c.IndentedJSON(http.StatusOK, &SummaryRsp{Content: rsp.Choices[0].Message.Content})
}
